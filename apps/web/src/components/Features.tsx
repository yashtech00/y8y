import { Card } from "../components/ui/card";
import { Zap, Puzzle, Shield, BarChart, Globe, Smartphone } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Zap,
      title: "No-Code Automation",
      description: "Build powerful workflows with our intuitive visual editor. No programming knowledge required.",
    },
    {
      icon: Puzzle,
      title: "400+ Integrations",
      description: "Connect with all your favorite tools and services. From CRM to social media, we've got you covered.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with SOC 2 compliance, end-to-end encryption, and granular access controls.",
    },
    {
      icon: BarChart,
      title: "Real-time Analytics",
      description: "Monitor your workflows with detailed analytics and insights to optimize your automation strategy.",
    },
    {
      icon: Globe,
      title: "Cloud & On-Premise",
      description: "Deploy in the cloud or on your own infrastructure. Complete flexibility for your organization.",
    },
    {
      icon: Smartphone,
      title: "Mobile Ready",
      description: "Manage and monitor your workflows from anywhere with our mobile-responsive interface.",
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Why teams choose</span>{" "}
            <span className="text-primary">our platform</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to automate your workflows and boost productivity across your entire organization.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-8 bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-card group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;