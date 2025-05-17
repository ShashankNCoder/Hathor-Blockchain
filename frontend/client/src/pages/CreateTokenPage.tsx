import React, { useState } from 'react';
import { useLocation } from 'wouter';
import CreateTokenModal from '@/components/CreateTokenModal';
import { useToast } from '@/hooks/use-toast';

const CreateTokenPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(true);

  const handleClose = () => {
    setShowModal(false);
    setLocation('/wallet');
  };

  const handleSuccess = (tokenId: string, name: string, symbol: string) => {
    toast({
      title: "Token Created Successfully",
      description: `${name} (${symbol}) has been created. You can now use it in your communities.`
    });
    setLocation('/wallet');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <CreateTokenModal 
        isVisible={showModal}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default CreateTokenPage; 