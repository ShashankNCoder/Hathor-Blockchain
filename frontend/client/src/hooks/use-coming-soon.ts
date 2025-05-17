import { useToast } from "@/hooks/use-toast";

export const useComingSoon = () => {
  const { toast } = useToast();

  const notifyComingSoon = (featureName?: string) => {
    toast({
      title: "Coming Soon",
      description: featureName 
        ? `${featureName} functionality will be available soon!` 
        : "This functionality will be available soon!",
      variant: "default"
    });
  };

  return { notifyComingSoon };
}; 