import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinDocument: (documentId: string) => void;
  leaveDocument: (documentId: string) => void;
  emitSignatureAdded: (data: any) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token) {
      console.log('🔌 Connecting to WebSocket server...');
      
      const socketInstance = io('http://localhost:9999', {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });

      socketInstance.on('connect', () => {
        console.log('✅ WebSocket connected:', socketInstance.id);
        setIsConnected(true);
        
        // Authenticate the socket
        socketInstance.emit('authenticate', token);
      });

      socketInstance.on('disconnect', () => {
        console.log('❌ WebSocket disconnected');
        setIsConnected(false);
      });

      socketInstance.on('connect_error', (error) => {
        console.error('❌ WebSocket connection error:', error);
        setIsConnected(false);
      });

      // Handle signature updates
      socketInstance.on('signature-update', (data) => {
        console.log('📝 Signature update received:', data);
        // You can emit custom events here for components to listen to
        window.dispatchEvent(new CustomEvent('signature-update', { detail: data }));
      });

      setSocket(socketInstance);

      return () => {
        console.log('🔌 Disconnecting WebSocket...');
        socketInstance.disconnect();
        setSocket(null);
        setIsConnected(false);
      };
    }
  }, [isAuthenticated, token]);

  const joinDocument = (documentId: string) => {
    if (socket && isConnected) {
      console.log('📄 Joining document:', documentId);
      socket.emit('join-document', documentId);
    }
  };

  const leaveDocument = (documentId: string) => {
    if (socket && isConnected) {
      console.log('📄 Leaving document:', documentId);
      socket.emit('leave-document', documentId);
    }
  };

  const emitSignatureAdded = (data: any) => {
    if (socket && isConnected) {
      console.log('✏️ Emitting signature added:', data);
      socket.emit('signature-added', data);
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    joinDocument,
    leaveDocument,
    emitSignatureAdded,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
