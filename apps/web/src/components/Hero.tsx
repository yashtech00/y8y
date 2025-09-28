import { Button } from "../components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-automation.jpg";
import { Link } from "react-router";

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
            {/* Professional gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
                    backgroundSize: '50px 50px'
                }} />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 bg-card/30 border border-primary/20 rounded-full text-sm text-muted-foreground mb-8 backdrop-blur-sm">
                        <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
                        Next-generation workflow automation
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                        <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                            Automate
                        </span>{" "}
                        <span className="text-foreground">anything</span>
                        <br />
                        <span className="text-foreground">with</span>{" "}
                        <span className="text-primary">visual workflows</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                        Connect your tools, automate repetitive tasks, and build powerful workflows
                        without writing a single line of code. Join thousands of teams already automating their work.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/signin">
                            <Button variant="default" size="lg" className="text-lg px-8 py-6 h-auto">
                                Start automating free
                                <ArrowRight className="ml-2" />
                            </Button>
                        </Link>

                        <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto">
                            <Play className="mr-2" />
                            Watch demo
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mt-16 text-sm text-muted-foreground">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-primary mr-2">500K+</span>
                            workflows created
                        </div>
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-primary mr-2">1M+</span>
                            tasks automated daily
                        </div>
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-primary mr-2">400+</span>
                            integrations
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle accent elements */}
            <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-primary/20 rounded-full"></div>
            <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-primary/30 rounded-full"></div>
        </section>
    );
};

export default Hero;