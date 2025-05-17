import { useEffect, useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import WelcomePage from "@/pages/WelcomePage";
import HomePage from "@/pages/HomePage";
import WalletPage from "@/pages/WalletPage";
import RewardsPage from "@/pages/RewardsPage";
import ProfilePage from "@/pages/ProfilePage";
import CreateTokenPage from "@/pages/CreateTokenPage";
import LoadingScreen from "@/components/LoadingScreen";
import { useWallet } from "@/context/WalletContext";
import { initTelegramApp } from "@/lib/telegram";

function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { isAuthenticated } = useWallet();

  if (!isAuthenticated) return <>{children}</>;

  return (
    <div className="relative min-h-screen flex flex-col">
      <main className="flex-1 pt-14 pb-16">
        {children}
      </main>
    </div>
  );
}

function Router() {
  const { isAuthenticated } = useWallet();
  const [location, setLocation] = useLocation();

  // Only redirect if user is authenticated and explicitly on root path
  useEffect(() => {
    if (isAuthenticated && location === "/") {
      console.log("Router: User is authenticated and at root, redirecting to /home");
      setLocation("/", { replace: true });
    }
  }, [isAuthenticated, location, setLocation]);

  return (
    <Layout>
      <Switch>
        <Route path="/" component={WelcomePage} />
        <Route path="/home" component={HomePage} />
        <Route path="/wallet" component={WalletPage} />
        <Route path="/rewards" component={RewardsPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/create-token" component={CreateTokenPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Initialize Telegram Mini App
    const initializeApp = () => {
      try {
        if (window.Telegram && window.Telegram.WebApp) {
          // Initialize Telegram Web App
          initTelegramApp();
          
          // Set proper viewport for Telegram Web App
          const viewportMeta = document.querySelector('meta[name="viewport"]');
          if (viewportMeta) {
            viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
          }
          
          // Set proper theme
          if (window.Telegram.WebApp.colorScheme === 'dark') {
            document.documentElement.classList.add('dark');
          }
        } else {
          // Running in browser mode
          console.log('Running in browser mode');
        }
        
        // Wait a short time to ensure everything is initialized
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
      } catch (error) {
        console.error('Error initializing Telegram Web App:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {isLoading ? <LoadingScreen /> : <Router />}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
