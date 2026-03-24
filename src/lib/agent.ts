import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { useStore } from '../store';

let ws: WebSocket | null = null;
let isConnecting = false;

export const connectLocalAgent = (url: string = 'ws://localhost:8765') => {
  if (ws || isConnecting) return;
  isConnecting = true;

  try {
    ws = new WebSocket(url);

    ws.onopen = () => {
      useStore.getState().setLocalConnected(true);
      useStore.getState().addMessage({
        role: 'system',
        content: 'Connected to local agent at ' + url,
      });
      isConnecting = false;
    };

    ws.onclose = () => {
      useStore.getState().setLocalConnected(false);
      useStore.getState().addMessage({
        role: 'system',
        content: 'Disconnected from local agent.',
      });
      ws = null;
      isConnecting = false;
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      ws?.close();
    };
  } catch (e) {
    console.error('Failed to connect:', e);
    isConnecting = false;
  }
};

export const disconnectLocalAgent = () => {
  if (ws) {
    ws.close();
  }
};

export const executeLocalCommand = async (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      resolve('Error: Local agent is not connected. Please connect first.');
      return;
    }

    const messageId = Math.random().toString(36).substring(7);
    
    const listener = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.id === messageId) {
          ws?.removeEventListener('message', listener);
          resolve(data.output || data.error || 'Command executed with no output.');
        }
      } catch (e) {
        // Ignore non-JSON messages or unrelated messages
      }
    };

    ws.addEventListener('message', listener);
    ws.send(JSON.stringify({ id: messageId, action: 'execute', command }));

    // Timeout after 30 seconds
    setTimeout(() => {
      ws?.removeEventListener('message', listener);
      resolve('Error: Command execution timed out.');
    }, 30000);
  });
};

const executeCommandTool: FunctionDeclaration = {
  name: 'execute_command',
  description: "Executes a shell command on the user's local computer and returns the output. Use this to perform actions, read files, or control the system.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      command: {
        type: Type.STRING,
        description: 'The shell command to execute (e.g., "dir", "ls -la", "python script.py", "start notepad").',
      },
    },
    required: ['command'],
  },
};

const rememberFactTool: FunctionDeclaration = {
  name: 'remember_fact',
  description: "Saves a fact or memory permanently to your knowledge base so you never forget it. Use this when the user tells you something important about themselves or their preferences.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      fact: {
        type: Type.STRING,
        description: 'The fact to remember (e.g., "User loves the color blue", "User has a dog named Max").',
      },
    },
    required: ['fact'],
  },
};

export const runAgentLoop = async (userMessage: string) => {
  const store = useStore.getState();
  store.setAgentRunning(true);
  store.addMessage({ role: 'user', content: userMessage });

  try {
    const apiKey = store.config.apiKey || process.env.GEMINI_API_KEY;
    if (!apiKey && store.config.provider !== 'ollama') {
      throw new Error('API Key is missing. Please configure it in the settings.');
    }

    const memoryContext = store.memories.length > 0 
      ? `\n\nUSER'S MEMORIES & FACTS (Do not forget these):\n${store.memories.map(m => `- ${m.content}`).join('\n')}`
      : '';
      
    const skillsContext = store.skills.length > 0
      ? `\n\nLEARNED SKILLS (You can use these when requested):\n${store.skills.map(s => `[${s.name}]: ${s.description}\nInstructions: ${s.instruction}`).join('\n\n')}`
      : '';
      
    const fullSystemPrompt = store.systemPrompt + memoryContext + skillsContext;

    if (store.config.provider === 'gemini') {
      const ai = new GoogleGenAI({ apiKey });
      
      // Format history for Gemini
      const history = store.messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role === 'agent' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

      history.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });

      let response = await ai.models.generateContent({
        model: store.config.modelName || 'gemini-3.1-pro-preview',
        contents: history,
        config: {
          systemInstruction: fullSystemPrompt,
          tools: [{ functionDeclarations: [executeCommandTool, rememberFactTool] }],
        },
      });
      
      // Handle tool calls
      while (response.functionCalls && response.functionCalls.length > 0) {
        for (const call of response.functionCalls) {
          if (call.name === 'execute_command') {
            const args = call.args as { command: string };
            store.addMessage({
              role: 'system',
              content: `> Executing local command: ${args.command}`,
            });
            
            const output = await executeLocalCommand(args.command);
            
            store.addXp(15); // Award XP for executing commands
            
            store.addMessage({
              role: 'system',
              content: `> Output:\n\`\`\`\n${output}\n\`\`\``,
            });

            // Add the tool call and response to history
            history.push({
              role: 'model',
              parts: [{ functionCall: call }]
            } as any);
            
            history.push({
              role: 'user',
              parts: [{ functionResponse: { name: call.name, response: { result: output } } }]
            } as any);

            // Get the next response from the model
            response = await ai.models.generateContent({
              model: store.config.modelName || 'gemini-3.1-pro-preview',
              contents: history,
              config: {
                systemInstruction: fullSystemPrompt,
                tools: [{ functionDeclarations: [executeCommandTool, rememberFactTool] }],
              },
            });
          } else if (call.name === 'remember_fact') {
            const args = call.args as { fact: string };
            store.addMemory(args.fact);
            
            store.addMessage({
              role: 'system',
              content: `> 🧠 Memory saved: ${args.fact}`,
            });

            // Add the tool call and response to history
            history.push({
              role: 'model',
              parts: [{ functionCall: call }]
            } as any);
            
            history.push({
              role: 'user',
              parts: [{ functionResponse: { name: call.name, response: { result: "Fact saved successfully." } } }]
            } as any);

            // Get the next response from the model
            response = await ai.models.generateContent({
              model: store.config.modelName || 'gemini-3.1-pro-preview',
              contents: history,
              config: {
                systemInstruction: fullSystemPrompt,
                tools: [{ functionDeclarations: [executeCommandTool, rememberFactTool] }],
              },
            });
          }
        }
      }

      if (response.text) {
        store.addMessage({ role: 'agent', content: response.text });
      }
    } else {
      // OpenAI Compatible API Logic (DeepSeek, Qwen, Zhipu, Moonshot, Ollama, OpenAI)
      let endpoint = store.config.endpoint;
      if (!endpoint) {
        switch(store.config.provider) {
          case 'deepseek': endpoint = 'https://api.deepseek.com/v1/chat/completions'; break;
          case 'qwen': endpoint = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'; break;
          case 'zhipu': endpoint = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'; break;
          case 'moonshot': endpoint = 'https://api.moonshot.cn/v1/chat/completions'; break;
          case 'openai': endpoint = 'https://api.openai.com/v1/chat/completions'; break;
          case 'ollama': endpoint = 'http://localhost:11434/v1/chat/completions'; break;
          default: throw new Error('Endpoint URL is required for this provider.');
        }
      } else {
        if (!endpoint.endsWith('/chat/completions') && !endpoint.endsWith('/api/chat')) {
          endpoint = endpoint.replace(/\/$/, '') + '/v1/chat/completions';
        }
      }

      const messages = [
        { role: 'system', content: fullSystemPrompt },
        ...store.messages.filter(m => m.role !== 'system').map(m => ({
          role: m.role === 'agent' ? 'assistant' : 'user',
          content: m.content
        })),
        { role: 'user', content: userMessage }
      ];

      const tools = [{
        type: "function",
        function: {
          name: "execute_command",
          description: "Executes a shell command on the user's local computer and returns the output. Use this to perform actions, read files, or control the system.",
          parameters: {
            type: "object",
            properties: {
              command: { type: "string", description: "The shell command to execute" }
            },
            required: ["command"]
          }
        }
      }, {
        type: "function",
        function: {
          name: "remember_fact",
          description: "Saves a fact or memory permanently to your knowledge base so you never forget it.",
          parameters: {
            type: "object",
            properties: {
              fact: { type: "string", description: "The fact to remember" }
            },
            required: ["fact"]
          }
        }
      }];

      let currentMessages: any[] = [...messages];
      let isDone = false;

      while (!isDone) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {})
          },
          body: JSON.stringify({
            model: store.config.modelName || 'deepseek-chat',
            messages: currentMessages,
            tools: tools,
            tool_choice: "auto"
          })
        });

        if (!res.ok) {
          const err = await res.text();
          throw new Error(`API Error: ${res.status} ${err}`);
        }

        const data = await res.json();
        const responseMessage = data.choices[0].message;

        if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
          currentMessages.push(responseMessage);
          
          for (const toolCall of responseMessage.tool_calls) {
            if (toolCall.function.name === 'execute_command') {
              const args = JSON.parse(toolCall.function.arguments);
              store.addMessage({
                role: 'system',
                content: `> Executing local command: ${args.command}`,
              });
              
              const output = await executeLocalCommand(args.command);
              
              store.addXp(15); // Award XP for executing commands
              
              store.addMessage({
                role: 'system',
                content: `> Output:\n\`\`\`\n${output}\n\`\`\``,
              });

              currentMessages.push({
                role: 'tool',
                tool_call_id: toolCall.id,
                name: toolCall.function.name,
                content: output
              });
            } else if (toolCall.function.name === 'remember_fact') {
              const args = JSON.parse(toolCall.function.arguments);
              store.addMemory(args.fact);
              
              store.addMessage({
                role: 'system',
                content: `> 🧠 Memory saved: ${args.fact}`,
              });

              currentMessages.push({
                role: 'tool',
                tool_call_id: toolCall.id,
                name: toolCall.function.name,
                content: "Fact saved successfully."
              });
            }
          }
        } else {
          if (responseMessage.content) {
            store.addMessage({ role: 'agent', content: responseMessage.content });
          }
          isDone = true;
        }
      }
    }
  } catch (error: any) {
    store.addMessage({
      role: 'system',
      content: `Error: ${error.message || 'An unknown error occurred.'}`,
    });
  } finally {
    store.setAgentRunning(false);
  }
};
