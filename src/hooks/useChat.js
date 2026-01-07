import { useState, useRef, useEffect } from 'react';
import { TourAgent } from '../logic/flow';

export function useChat() {
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const agentRef = useRef(new TourAgent());

    // Initialize Greeting
    useEffect(() => {
        if (messages.length === 0) {
            setIsTyping(true);

            const initGreeting = async () => {
                const response = await agentRef.current.process('');
                const msg = {
                    id: 1,
                    text: response.text,
                    sender: 'agent',
                    timestamp: new Date(),
                    data: response.data
                };
                setMessages([msg]);
                setIsTyping(false);
            };

            setTimeout(initGreeting, 1000);
        }
    }, []);

    const sendMessage = async (text, isHidden = false) => {
        // 1. Add user message (only if not hidden)
        if (!isHidden) {
            const userMsg = {
                id: Date.now(),
                text,
                sender: 'user',
                timestamp: new Date()
            };
            setMessages(prev => {
                // Hide buttons on previous agent messages
                const updatedPrev = prev.map(msg => {
                    if (msg.sender === 'agent' && msg.data && (msg.data.type === 'quick_replies' || msg.data.type === 'address_picker')) {
                        return { ...msg, data: { ...msg.data, items: null } }; // Determine if we should nullify items or add a flag
                    }
                    return msg;
                });
                return [...updatedPrev, userMsg];
            });
        }
        setIsTyping(true);

        // 2. Process via Agent
        try {
            // Wait for 1s artificial delay + async process time
            await new Promise(r => setTimeout(r, 1000));

            const response = await agentRef.current.process(text);

            const newMessages = Array.isArray(response) ? response : [response];

            for (let i = 0; i < newMessages.length; i++) {
                const res = newMessages[i];
                if (i > 0) await new Promise(r => setTimeout(r, 800)); // Delay between consecutive messages

                const agentMsg = {
                    id: Date.now() + i + 1,
                    text: res.text,
                    sender: 'agent',
                    timestamp: new Date(),
                    data: res.data
                };
                setMessages(prev => [...prev, agentMsg]);
            }
        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "죄송합니다. 오류가 발생했습니다.",
                sender: 'agent',
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return {
        messages,
        isTyping,
        sendMessage
    };
}
