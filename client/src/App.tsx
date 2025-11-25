import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Navigation from "@/components/Navigation";
import Dashboard from "@/pages/Dashboard";
import Books from "@/pages/Books";
import Students from "@/pages/Students";
import Borrow from "@/pages/Borrow";
import History from "@/pages/History";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/books" component={Books} />
      <Route path="/students" component={Students} />
      <Route path="/borrow" component={Borrow} />
      <Route path="/history" component={History} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="container mx-auto px-6 py-8">
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
