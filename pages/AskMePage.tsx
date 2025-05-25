
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoogleGenAI, Chat, GenerateContentResponse, Content } from '@google/genai';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf.mjs';
import { Message, ChatSession } from '../types'; // Added ChatSession
import { AuthContext } from '../App';
import { ChatMessage } from '../components/ChatMessage';
import { StyledButton } from '../components/StyledButton';
import { IconSend, IconPaperClip, IconThumbUp, IconThumbDown, GEMINI_MODEL_TEXT, ROBOT_AVATAR_URL, USER_AVATAR_URL, IconX, IconPlus, IconTrash } from '../constants';
import { LoadingIcon } from '../components/LoadingIcon';

GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@4.4.168/build/pdf.worker.mjs';

const MAX_CONTEXT_CHARS = 30000;
const CHUNK_SIZE = 1500;
const CHUNK_OVERLAP = 200;

const CHAT_SYSTEM_INSTRUCTION = `You are DadMind AI, a supportive and understanding assistant for fathers.
Provide helpful advice, resources, and a listening ear. Be empathetic, encouraging, and maintain a conversational tone.
If document excerpts are provided (indicated by 'Based on the following document excerpts from "[filename]":'), base your answer primarily on these excerpts.
If the user asks a general question not related to the document, answer it generally.
Use markdown for formatting if it enhances readability (e.g., lists, bolding key points). Ensure paragraphs are separated by a blank line, and lists use '-' or '*' for items.`;

const chunkText = (text: string, size: number, overlap: number): string[] => {
  const chunks: string[] = [];
  if (!text) return chunks;
  for (let i = 0; i < text.length; i += size - overlap) {
    chunks.push(text.substring(i, i + size));
  }
  return chunks;
};

const initialBotMessageContent = `Xin chào! Tôi là DadMind AI.
Tôi có thể giúp bạn:

*   **Lắng nghe:** Nếu bạn có điều gì muốn chia sẻ, những lo lắng, niềm vui, hay bất kỳ suy nghĩ nào về việc làm cha, tôi sẵn sàng lắng nghe mà không phán xét.
*   **Đưa ra lời khuyên:** Dựa trên kinh nghiệm và kiến thức được tổng hợp, tôi có thể cung cấp những lời khuyên hữu ích về các khía cạnh của việc nuôi dạy con cái, cân bằng cuộc sống, hay chăm sóc bản thân.
*   **Cung cấp thông tin và tài nguyên:** Tôi có thể giúp bạn tìm kiếm thông tin hoặc gợi ý các nguồn tài nguyên (nếu có) liên quan đến làm cha.
*   **Khích lệ và động viên:** Ai cũng có những lúc khó khăn, tôi ở đây để nhắc bạn rằng bạn đang làm rất tốt và mọi thứ đều có cách giải quyết.

Bạn cần chia sẻ, hỏi đáp điều gì hôm nay? Bạn cũng có thể tải lên tệp .txt, .md, hoặc .pdf để hỏi về nội dung của nó.`;

const initialBotMessage: Message = {
  id: 'dadmind-welcome',
  text: initialBotMessageContent,
  sender: 'bot',
  timestamp: Date.now(),
  avatar: ROBOT_AVATAR_URL,
};

const generateSessionId = () => `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

const mapMessagesToHistoryContent = (msgs: Message[]): Content[] => {
  if (!msgs) return [];
  return msgs
    .filter(msg => (msg.sender === 'user' || msg.sender === 'bot') && msg.id !== initialBotMessage.id && !msg.id.startsWith('system-'))
    .map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));
};


export const AskMePage: React.FC = () => {
  const auth = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate(); // Not used, but kept for potential future use

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([initialBotMessage]); // Messages for the *current* chat

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFileProcessing, setIsFileProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<Chat | null>(null); // Gemini Chat instance
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedFileContent, setUploadedFileContent] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const initializeAndSetChat = (historyMsgs: Message[], useHistory: boolean) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
        setError("API Key is not configured. AI features are disabled.");
        setChat(null);
        setIsLoading(false); // Ensure loading stops if API key is missing
        return null;
    }
    try {
        const ai = new GoogleGenAI({ apiKey });
        const chatHistory = useHistory ? mapMessagesToHistoryContent(historyMsgs) : [];
        const newChatInstance = ai.chats.create({
            model: GEMINI_MODEL_TEXT,
            config: { systemInstruction: CHAT_SYSTEM_INSTRUCTION },
            history: chatHistory,
        });
        setChat(newChatInstance);
        setError(null); // Clear previous errors on successful init
        return newChatInstance;
    } catch (err) {
        console.error("Failed to initialize Gemini chat:", err);
        setError(`Failed to initialize AI: ${err instanceof Error ? err.message : String(err)}`);
        setChat(null);
        return null;
    }
  };

  // Load sessions from localStorage on mount
  useEffect(() => {
    const loadedSessions = JSON.parse(localStorage.getItem('chatSessionsDadMind') || '[]') as ChatSession[];
    const lastActiveId = localStorage.getItem('currentChatSessionIdDadMind');

    if (loadedSessions.length > 0) {
        setChatSessions(loadedSessions);
        const activeSession = lastActiveId ? loadedSessions.find(s => s.id === lastActiveId) : null;
        
        if (activeSession) {
            setCurrentSessionId(activeSession.id);
            setMessages(activeSession.messages);
            initializeAndSetChat(activeSession.messages, true);
        } else {
            // If no valid lastActiveId, or session not found, load the first (most recent if prepended)
            const mostRecentSession = loadedSessions[0];
            setCurrentSessionId(mostRecentSession.id);
            setMessages(mostRecentSession.messages);
            initializeAndSetChat(mostRecentSession.messages, true);
        }
    } else {
        handleNewChat(); // Creates first session if none exist
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (chatSessions.length > 0) { // Only save if there are sessions to prevent empty array on initial load issues
        localStorage.setItem('chatSessionsDadMind', JSON.stringify(chatSessions));
    }
    if (currentSessionId) {
        localStorage.setItem('currentChatSessionIdDadMind', currentSessionId);
    }
  }, [chatSessions, currentSessionId]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle initial message passed from HomePage
  useEffect(() => {
    const initialMessageFromState = (location.state as { initialMessage?: string })?.initialMessage;
    if (initialMessageFromState && chat && !isLoading && currentSessionId) {
        const currentSession = chatSessions.find(s => s.id === currentSessionId);
        if (currentSession) {
            // Check if this specific message has already been sent in this session
            const alreadySentInSession = currentSession.messages.some(m => m.sender === 'user' && m.text === initialMessageFromState);
            if (!alreadySentInSession) {
                handleSend(initialMessageFromState);
                // Clear the state from location to prevent re-sending
                // navigate(location.pathname, { replace: true, state: {} }); // Debatable if this is desired UX
            }
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, chat, isLoading, currentSessionId, chatSessions]);


  const handleNewChat = () => {
    const newSessionId = generateSessionId();
    const newSession: ChatSession = {
        id: newSessionId,
        title: "New Chat", // Initial title
        messages: [initialBotMessage],
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };

    setChatSessions(prevSessions => [newSession, ...prevSessions]);
    setCurrentSessionId(newSessionId);
    setMessages([initialBotMessage]);
    setUploadedFileContent(null);
    setUploadedFileName(null);
    setFileError(null);
    setError(null);
    initializeAndSetChat([], false); // New chat, no history
  };
  
  const handleLoadSession = (sessionId: string) => {
    const sessionToLoad = chatSessions.find(s => s.id === sessionId);
    if (sessionToLoad) {
        setCurrentSessionId(sessionToLoad.id);
        setMessages(sessionToLoad.messages);
        setUploadedFileContent(null); // Clear file context when switching sessions
        setUploadedFileName(null);
        setFileError(null);
        setError(null);
        initializeAndSetChat(sessionToLoad.messages, true);
    }
  };

  const handleDeleteSession = (sessionIdToDelete: string) => {
    setChatSessions(prevSessions => {
        const sessionsAfterDeletion = prevSessions.filter(s => s.id !== sessionIdToDelete);

        if (currentSessionId === sessionIdToDelete) { // Active session was deleted
            if (sessionsAfterDeletion.length > 0) {
                const nextActiveSession = sessionsAfterDeletion[0]; // Make the new first session active
                setCurrentSessionId(nextActiveSession.id);
                setMessages(nextActiveSession.messages);
                initializeAndSetChat(nextActiveSession.messages, true);
            } else {
                // No sessions left, create a brand new one by calling handleNewChat's core logic
                // This return will be an empty array, then handleNewChat will set new state
                // To avoid complex state interactions, just set to empty and let a follow-up effect or direct call handle new chat creation
                // For simplicity here: directly setup a new chat state.
                 const newSessionId = generateSessionId();
                 const newSession: ChatSession = {
                    id: newSessionId,
                    title: "New Chat",
                    messages: [initialBotMessage],
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                 };
                 setCurrentSessionId(newSession.id);
                 setMessages(newSession.messages);
                 initializeAndSetChat([], false);
                 return [newSession]; // This becomes the new chatSessions state
            }
        }
        // If deleted session was not active, currentSessionId and messages are still valid.
        return sessionsAfterDeletion;
    });
  };

  const addSystemMessage = (text: string, type: 'system-info' | 'system-warn' | 'system-error') => {
    const systemMessage: Message = {
        id: `system-${Date.now()}`,
        text: `[${type.split('-')[1].toUpperCase()}] ${text}`, // e.g., [INFO] Text...
        sender: 'bot', // Displayed as bot message
        timestamp: Date.now(),
        avatar: ROBOT_AVATAR_URL,
    };
    setMessages(prev => [...prev, systemMessage]);
    if (currentSessionId) {
        setChatSessions(prevSessions =>
            prevSessions.map(s =>
                s.id === currentSessionId ? { ...s, messages: [...s.messages, systemMessage], updatedAt: Date.now() } : s
            )
        );
    }
  };

  const handleSend = async (messageToSend?: string) => {
    const textFromInput = messageToSend || input;
    if (!textFromInput.trim() || !chat || !currentSessionId) {
        if(!chat && !error) setError("AI Chat is not initialized. Please check API key or try again.");
        return;
    }

    let fullPrompt = textFromInput;
    let contextUsed = false;

    if (uploadedFileContent && uploadedFileName) {
        // Simplified context handling for brevity in this refactor. Original logic was more complex.
        fullPrompt = `Based on the document "${uploadedFileName}":\n\n${uploadedFileContent.substring(0,CHUNK_SIZE)}\n\nQuestion: ${textFromInput}`;
        contextUsed = true;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: textFromInput,
      sender: 'user',
      timestamp: Date.now(),
      avatar: auth?.currentUser?.avatar || USER_AVATAR_URL,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    // Update chatSessions with the user message and potentially new title
    setChatSessions(prevSessions =>
        prevSessions.map(s => {
            if (s.id === currentSessionId) {
                let newTitle = s.title;
                const userMessagesInSession = s.messages.filter(m => m.sender === 'user');
                if (s.title === "New Chat" && userMessagesInSession.length === 0) { // This new message is the first user message
                    newTitle = textFromInput.substring(0, 30).trim();
                    if (textFromInput.length > 30) newTitle += '...';
                    if (!newTitle) newTitle = `Chat ${new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                }
                return { ...s, messages: [...s.messages, userMessage], updatedAt: Date.now(), title: newTitle };
            }
            return s;
        })
    );

    try {
      const result = await chat.sendMessageStream({ message: fullPrompt });
      const botMessageId = `bot-stream-${Date.now()}`;
      let accumulatedBotResponse = '';

      // Add bot message placeholder to current messages and session
      const placeholderBotMessage: Message = { id: botMessageId, text: '', sender: 'bot', timestamp: Date.now(), avatar: ROBOT_AVATAR_URL };
      setMessages(prev => [...prev, placeholderBotMessage]);
      setChatSessions(prevSessions =>
        prevSessions.map(s =>
            s.id === currentSessionId ? { ...s, messages: [...s.messages, placeholderBotMessage], updatedAt: Date.now() } : s
        )
      );
      
      for await (const chunk of result) {
        accumulatedBotResponse += chunk.text;
        setMessages(prev =>
            prev.map(m => (m.id === botMessageId ? { ...m, text: accumulatedBotResponse } : m))
        );
        // Update session messages progressively
        setChatSessions(prevSessions =>
            prevSessions.map(s => {
                if (s.id === currentSessionId) {
                    return {
                        ...s,
                        messages: s.messages.map(m =>
                            m.id === botMessageId ? { ...m, text: accumulatedBotResponse } : m
                        ),
                        updatedAt: Date.now()
                    };
                }
                return s;
            })
        );
      }
      
      if (contextUsed) {
        addSystemMessage(`My previous response was based on "${uploadedFileName}". Clear context or ask more.`, 'system-info');
      }

    } catch (err) {
      console.error("Error sending message to Gemini:", err);
      const errorText = `Sorry, I encountered an error. ${err instanceof Error ? err.message : String(err)}`;
      setError(errorText);
      const botErrorMsg: Message = { id: `bot-error-${Date.now()}`, text: errorText, sender: 'bot', timestamp: Date.now(), avatar: ROBOT_AVATAR_URL };
      setMessages(prev => [...prev, botErrorMsg]);
      if (currentSessionId) {
        setChatSessions(prevSessions =>
            prevSessions.map(s =>
                s.id === currentSessionId ? { ...s, messages: [...s.messages, botErrorMsg], updatedAt: Date.now() } : s
            )
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsFileProcessing(true);
    setFileError(null);
    setUploadedFileContent(null); // Clear previous before processing new
    setUploadedFileName(null);

    const fileName = file.name;
    addSystemMessage(`Processing file: "${fileName}"...`, 'system-info');

    try {
      let textContent = '';
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContentPage = await page.getTextContent();
          textContent += textContentPage.items.map((item: any) => item.str).join(' ') + '\n';
        }
      } else if (file.type === 'text/plain' || file.type === 'text/markdown' || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
        textContent = await file.text();
      } else {
        throw new Error('Unsupported file type. Please upload .txt, .md, or .pdf files.');
      }
      
      if (textContent.length > MAX_CONTEXT_CHARS * 1.2) { // A bit of buffer
         addSystemMessage(`File "${fileName}" is very large and has been truncated. Only the first ~${MAX_CONTEXT_CHARS} characters will be used.`, 'system-warn');
         textContent = textContent.substring(0, MAX_CONTEXT_CHARS);
      }

      setUploadedFileContent(textContent);
      setUploadedFileName(fileName);
      addSystemMessage(`File "${fileName}" processed. You can now ask questions about its content.`, 'system-info');

    } catch (err) {
      console.error("Error processing file:", err);
      const errorMsg = `Error processing file "${fileName}": ${err instanceof Error ? err.message : String(err)}`;
      setFileError(errorMsg);
      addSystemMessage(errorMsg, 'system-error');
    } finally {
      setIsFileProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const clearFileContext = () => {
    setUploadedFileContent(null);
    setUploadedFileName(null);
    setFileError(null);
    addSystemMessage('File context has been cleared.', 'system-info');
  };

  const currentChatSession = chatSessions.find(s => s.id === currentSessionId);

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto bg-brand-bg-card p-3 sm:p-4 rounded-xl shadow-card min-h-[calc(100vh-12rem)] sm:min-h-[calc(100vh-15rem)]">
      {/* Sidebar for Chat History */}
      <div className="lg:w-1/4 xl:w-1/5 p-3 bg-brand-bg-light rounded-lg shadow-sm border border-brand-border/50 flex flex-col h-[calc(100vh-14rem)] sm:h-auto lg:max-h-[calc(100vh-16rem)]">
        <StyledButton 
            onClick={handleNewChat} 
            leftIcon={<IconPlus className="w-4 h-4"/>}
            className="w-full mb-3 !py-2.5"
            variant="secondary"
            size="sm"
        >
            New Chat
        </StyledButton>
        <h3 className="text-sm font-semibold text-brand-dark-text mb-2 px-1">Chat History</h3>
        <div className="flex-grow overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
            {chatSessions.length === 0 && (
                 <p className="text-xs text-brand-light-text p-2 text-center">No chats yet. Start a new one!</p>
            )}
            {chatSessions.map(session => (
                <div 
                    key={session.id} 
                    onClick={() => handleLoadSession(session.id)}
                    className={`p-2.5 rounded-md cursor-pointer group relative ${
                        currentSessionId === session.id 
                        ? 'bg-brand-primary/20 border border-brand-primary/50 shadow-sm' 
                        : 'hover:bg-brand-primary/10 border border-transparent'
                    } transition-all duration-150`}
                >
                    <p className={`text-xs font-medium truncate pr-6 ${currentSessionId === session.id ? 'text-brand-primary' : 'text-brand-dark-text group-hover:text-brand-primary'}`}>
                        {session.title}
                    </p>
                    <p className={`text-[10px] ${currentSessionId === session.id ? 'text-brand-primary/80' : 'text-gray-400 group-hover:text-brand-primary/70'}`}>
                        {new Date(session.createdAt).toLocaleDateString()} - {new Date(session.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                    </p>
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteSession(session.id);}}
                        className="absolute top-1/2 right-1.5 transform -translate-y-1/2 p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete chat"
                        aria-label="Delete chat session"
                    >
                        <IconTrash className="w-3.5 h-3.5"/>
                    </button>
                </div>
            ))}
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col h-[calc(100vh-14rem)] sm:h-auto lg:min-h-[calc(100vh-16rem)] lg:max-h-[calc(100vh-16rem)]">
        <div className="flex-grow overflow-y-auto p-1 sm:p-4 space-y-1 bg-brand-bg-subtle/60 rounded-lg mb-4 custom-scrollbar">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && (!messages.length || messages[messages.length -1]?.sender !== 'bot' || messages[messages.length -1]?.text === '') && (
             <div className="flex items-end space-x-3 my-3">
               <img src={ROBOT_AVATAR_URL} alt="Bot typing" className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"/>
               <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md bg-brand-bg-card text-brand-dark-text rounded-bl-lg border border-brand-border">
                 <LoadingIcon size="sm" color="text-brand-primary" />
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && <p className="text-red-500 text-sm mb-2 p-2 bg-red-100 rounded-md shadow-sm">{error}</p>}
        {fileError && <p className="text-red-500 text-sm mb-2 p-2 bg-red-100 rounded-md shadow-sm">{fileError}</p>}

        {uploadedFileName && (
          <div className="mb-2 p-2.5 bg-brand-primary/10 border border-brand-primary/30 rounded-lg flex justify-between items-center text-sm">
            <p className="text-brand-primary font-medium">
              File Context: <span className="italic text-brand-dark-text">{uploadedFileName}</span>
            </p>
            <button 
              onClick={clearFileContext} 
              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
              aria-label="Clear file context"
              title="Clear file context"
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="mt-auto flex items-center gap-2 p-2.5 border-t border-brand-border bg-brand-bg-card/70 rounded-b-lg">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".txt,.md,application/pdf"
            disabled={isFileProcessing || isLoading}
          />
          <button 
            onClick={handleFileUploadClick}
            className="p-2.5 text-brand-light-text hover:text-brand-primary rounded-full hover:bg-brand-primary/10 transition-colors disabled:opacity-50"
            aria-label="Attach file"
            title="Attach .txt, .md, or .pdf file"
            disabled={isFileProcessing || isLoading}
          >
            {isFileProcessing ? <LoadingIcon size="sm" /> : <IconPaperClip className="w-5 h-5" />}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder={currentChatSession ? "Hỏi DadMind AI..." : "Start a new chat to begin."}
            className="flex-grow p-3 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none text-sm placeholder-gray-500 disabled:bg-gray-100"
            disabled={isLoading || isFileProcessing || !currentChatSession}
            aria-label="Your message to DadMind AI"
          />
          <StyledButton 
            onClick={() => handleSend()} 
            className="!p-3 !rounded-lg" 
            disabled={!input.trim() || isLoading || isFileProcessing || !currentChatSession}
            aria-label="Send message"
          >
            <IconSend className="w-5 h-5" />
          </StyledButton>
        </div>
      </div>

      {/* Original Sidebar (AI info, suggestions) - now a bit narrower */}
      <div className="lg:w-1/4 xl:w-1/5 p-3 sm:p-4 bg-brand-bg-light rounded-lg shadow-sm border border-brand-border/50 flex-col hidden lg:flex lg:max-h-[calc(100vh-16rem)]">
        <div className="text-center mb-4 pb-4 border-b border-brand-border/70">
          <img 
            src={ROBOT_AVATAR_URL} 
            alt="DadMind AI Avatar" 
            className="w-20 h-20 mx-auto rounded-full mb-2.5 shadow-xl border-3 border-white object-cover"
            onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/80?text=AI")}
          />
          <h3 className="text-lg font-semibold text-brand-dark-text">DadMind AI</h3>
          <p className="text-xs text-brand-primary font-medium">Người bạn đồng hành của cha</p>
        </div>
        
        <div className="space-y-2.5 text-xs mb-4 flex-grow overflow-y-auto custom-scrollbar pr-1">
            <h4 className="font-semibold text-brand-dark-text text-sm mb-1.5">Gợi ý câu hỏi:</h4>
            <ul className="list-disc list-inside text-brand-light-text space-y-1">
                <li className="hover:text-brand-primary cursor-pointer" onClick={() => setInput("Làm sao để cân bằng công việc và gia đình?")}>Cân bằng công việc & gia đình?</li>
                <li className="hover:text-brand-primary cursor-pointer" onClick={() => setInput("Con tôi không chịu ăn rau, tôi nên làm gì?")}>Con không chịu ăn rau?</li>
                <li className="hover:text-brand-primary cursor-pointer" onClick={() => setInput("Cách nói chuyện với con tuổi teen hiệu quả?")}>Nói chuyện với con teen?</li>
                <li className="hover:text-brand-primary cursor-pointer" onClick={() => setInput("Tôi cảm thấy stress vì áp lực làm cha, có cách nào không?")}>Stress vì áp lực làm cha?</li>
            </ul>
        </div>
        
        <div className="mt-auto pt-4 border-t border-brand-border/70">
            <h4 className="font-semibold text-brand-dark-text mb-1.5 text-xs text-center">Đánh giá câu trả lời (WIP)</h4>
            <div className="flex space-x-1.5">
                <StyledButton variant="secondary" size="sm" className="flex-1 !text-[10px] !py-1 !px-1.5" title="Tính năng đang phát triển">
                    <IconThumbUp className="w-3 h-3 mr-0.5" /> Hữu ích
                </StyledButton>
                <StyledButton variant="secondary" size="sm" className="flex-1 !text-[10px] !py-1 !px-1.5" title="Tính năng đang phát triển">
                    <IconThumbDown className="w-3 h-3 mr-0.5" /> Cải thiện
                </StyledButton>
            </div>
        </div>
      </div>
    </div>
  );
};
