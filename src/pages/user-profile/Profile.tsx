import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserIcon, Package, MapPin, ChevronRight, Menu, Home } from "lucide-react";
import UserProfile from "./ProfileInfo";
import AddressManagement from "./AddressInfo";
import { useEffect, useState } from "react";
import CustomerOrderHistory from "./OrderInfo";
import { useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function ProfilePage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
  ];

  const tabContent = {
    profile: <UserProfile />,
    orders: <CustomerOrderHistory />,
    addresses: <AddressManagement />,
  };

  interface Tab {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }

  const TabButton = ({ tab, isActive, onClick, className = '' }: { tab: Tab; isActive: boolean; onClick: () => void; className?: string }) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      className={`justify-start rounded-lg h-14 px-6 w-full transition-all duration-200 ${
        isActive ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]" : "hover:bg-primary/5"
      } ${className}`}
      onClick={onClick}
    >
      <tab.icon className={`mr-3 h-5 w-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
      <span className="flex-grow text-left font-medium">{tab.label}</span>
      <ChevronRight className={`ml-auto h-4 w-4 transition-transform ${isActive ? 'translate-x-1 opacity-100' : 'opacity-50'}`} />
    </Button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center bg-background/50 backdrop-blur-sm p-4 rounded-2xl border shadow-sm">
            <div className="flex items-center gap-3">
              <Home className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  My Account
                </h1>
                <p className="text-muted-foreground text-sm mt-0.5">Manage your profile and preferences</p>
              </div>
            </div>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden relative">
                  <Menu className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full border-2 border-background" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] p-6">
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-2xl font-bold text-primary">Navigation</SheetTitle>
                </SheetHeader>
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <TabButton
                      key={tab.id}
                      tab={tab}
                      isActive={activeTab === tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                    />
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-full lg:w-1/4 sticky top-8">
              <Card className="shadow-lg border-primary/10 overflow-hidden backdrop-blur-sm bg-background/50">
                <CardHeader className="border-b bg-primary/5 pb-4">
                  <CardTitle className="text-lg font-semibold text-primary">Navigation</CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <nav className="space-y-2">
                    {tabs.map((tab) => (
                      <TabButton
                        key={tab.id}
                        tab={tab}
                        isActive={activeTab === tab.id}
                        onClick={() => setActiveTab(tab.id)}
                      />
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Content Area */}
            <div className="flex-1">
              <Card className="shadow-lg border-primary/10 overflow-hidden backdrop-blur-sm bg-background/50">
                <CardHeader className="border-b bg-primary/5">
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold text-primary">
                    {tabs.find(tab => tab.id === activeTab)?.icon && (
                      (() => {
                        const Icon = tabs.find(tab => tab.id === activeTab)!.icon;
                        return <Icon className="h-6 w-6" />;
                      })()
                    )}
                    {tabs.find(tab => tab.id === activeTab)?.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {tabContent[activeTab as keyof typeof tabContent]}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}