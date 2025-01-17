import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { UserIcon, Package, MapPin, ChevronRight, Menu } from "lucide-react";
import UserProfile from "./ProfileInfo";
import AddressManagement from "./AddressInfo";
import { useEffect, useState } from "react";
import CustomerOrderHistory from "./OrderInfo";
import { useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../../components/ui/sheet";

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
      variant="ghost"
      className={`justify-start rounded-none h-14 px-4 w-full ${
        isActive ? "bg-muted" : ""
      } ${className}`}
      onClick={onClick}
    >
      <tab.icon className="mr-2 h-4 w-4" />
      <span className="flex-grow text-left">{tab.label}</span>
      <ChevronRight className="ml-auto h-4 w-4" />
    </Button>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-bold">My Account</h1>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <Card>
                    <CardContent className="p-0">
                      <nav className="flex flex-col">
                        {tabs.map((tab, index) => (
                          <TabButton
                            key={tab.id}
                            tab={tab}
                            isActive={activeTab === tab.id}
                            onClick={() => {
                              setActiveTab(tab.id);
                              setIsMobileMenuOpen(false);
                            }}
                            className={index !== 0 ? "border-t" : ""}
                          />
                        ))}
                      </nav>
                    </CardContent>
                  </Card>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-full lg:w-1/4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Navigation</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <nav className="flex flex-col">
                    {tabs.map((tab, index) => (
                      <TabButton
                        key={tab.id}
                        tab={tab}
                        isActive={activeTab === tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={index !== 0 ? "border-t" : ""}
                      />
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Content Area */}
            <div className="flex-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {tabs.find(tab => tab.id === activeTab)?.icon && (
                      (() => {
                        const Icon = tabs.find(tab => tab.id === activeTab)!.icon;
                        return <Icon className="h-5 w-5" />;
                      })()
                    )}
                    {tabs.find(tab => tab.id === activeTab)?.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
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