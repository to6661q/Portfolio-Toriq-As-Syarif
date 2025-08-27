import { Github, Mail, Instagram, Linkedin, ChevronDown } from 'lucide-react';

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/10"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-glow/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main heading */}
          <div className="space-y-6 mb-8">
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="gradient-text">Toriq As Syarif</span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              Informatics Engineer
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Fully adaptable. Embrace the process, let's grow together!
            </p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-6 mb-16">
            <a 
              href="mailto:toriqnain@gmail.com"
              className="p-3 rounded-full bg-card-glass border border-border/20 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 hover:scale-110"
            >
              <Mail size={24} className="text-muted-foreground hover:text-primary transition-colors" />
            </a>
            <a 
              href="#"
              className="p-3 rounded-full bg-card-glass border border-border/20 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 hover:scale-110"
            >
              <Github size={24} className="text-muted-foreground hover:text-primary transition-colors" />
            </a>
            <a 
              href="#"
              className="p-3 rounded-full bg-card-glass border border-border/20 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 hover:scale-110"
            >
              <Linkedin size={24} className="text-muted-foreground hover:text-primary transition-colors" />
            </a>
            <a 
              href="#"
              className="p-3 rounded-full bg-card-glass border border-border/20 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 hover:scale-110"
            >
              <Instagram size={24} className="text-muted-foreground hover:text-primary transition-colors" />
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="animate-bounce">
            <button 
              onClick={() => scrollToSection('about')}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronDown size={32} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;