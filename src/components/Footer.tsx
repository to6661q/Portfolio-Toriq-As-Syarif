import { Github, Mail, Instagram, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card/50 border-t border-border/20 py-12">
      <div className="container-custom">
        <div className="text-center">
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            © {currentYear} Toriq As Syarif. Made with{' '}
            <Heart size={16} className="text-red-500 animate-pulse" />{' '}
            and lots of coffee ☕
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;