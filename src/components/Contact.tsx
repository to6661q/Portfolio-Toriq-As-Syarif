import { Card } from '@/components/ui/card';
import { Mail, Phone, Github, Instagram, Linkedin, MapPin, ExternalLink } from 'lucide-react';

const Contact = () => {
  const contactInfo = [
    {
      icon: <Mail size={24} />,
      label: 'Email',
      value: 'toriqnain@gmail.com',
      href: 'mailto:toriqnain@gmail.com',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Phone size={24} />,
      label: 'Phone',
      value: '(+62) 858-8078-9045',
      href: 'tel:+6285880789045',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <MapPin size={24} />,
      label: 'Location',
      value: 'Jakarta, Indonesia',
      href: '#',
      color: 'from-red-500 to-red-600'
    }
  ];

  const socialLinks = [
    {
      icon: <Github size={24} />,
      label: 'GitHub',
      value: 'View Projects',
      href: '#',
      description: 'Check out my projects and code contributions'
    },
    {
      icon: <Linkedin size={24} />,
      label: 'LinkedIn',
      value: 'Connect with me',
      href: '#',
      description: 'Connect for professional opportunities'
    },
    {
      icon: <Instagram size={24} />,
      label: 'Instagram',
      value: 'Follow me',
      href: '#',
      description: 'Follow my journey and daily insights'
    }
  ];

  return (
    <section id="contact" className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Let's <span className="gradient-text">Collaborate</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            I'm open to new opportunities, exciting projects, and discussions about technology. 
            Don't hesitate to reach out!
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-glow mx-auto rounded-full mt-6"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="card-glass p-6">
              <h3 className="text-xl font-bold mb-6 gradient-text">Contact Information</h3>
              <div className="space-y-4">
                {contactInfo.map((contact, index) => (
                  <a
                    key={index}
                    href={contact.href}
                    className="flex items-center p-4 bg-primary/5 rounded-lg border border-primary/20 hover:bg-primary/10 transition-all duration-300 group"
                  >
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${contact.color} text-white mr-4 group-hover:scale-110 transition-transform duration-300`}>
                      {contact.icon}
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{contact.label}</div>
                      <div className="text-foreground font-medium">{contact.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </Card>
          </div>

          {/* Social Media */}
          <div className="space-y-6">
            <Card className="card-glass p-6">
              <h3 className="text-xl font-bold mb-6 gradient-text">Social Media</h3>
              <div className="space-y-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="flex items-center p-4 bg-primary/5 rounded-lg border border-primary/20 hover:bg-primary/10 transition-all duration-300 group"
                  >
                    <div className="p-3 rounded-lg bg-gradient-to-r from-primary to-primary-glow text-white mr-4 group-hover:scale-110 transition-transform duration-300">
                      {social.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-foreground font-medium">{social.label}</div>
                      <div className="text-sm text-muted-foreground">{social.description}</div>
                    </div>
                    <ExternalLink size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;