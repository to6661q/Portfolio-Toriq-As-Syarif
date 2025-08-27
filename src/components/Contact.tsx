import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Github, Instagram, Linkedin, MapPin, Send } from 'lucide-react';

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

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
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

            {/* Social Links */}
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
                    <Github size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="lg:col-span-2">
            <Card className="card-glass p-8 h-full flex flex-col justify-center">
              <div className="text-center">
                <div className="mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Send size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Ready to Collaborate?</h3>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    I'm always interested in hearing about new opportunities, innovative projects, 
                    or even just discussing technology and current industry trends. 
                    Let's create something amazing together!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="btn-primary px-8 py-6 text-lg font-semibold"
                    onClick={() => window.location.href = 'mailto:toriqnain@gmail.com?subject=Let\'s Collaborate!'}
                  >
                    <Mail className="mr-2" size={20} />
                    Send Email
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="btn-ghost px-8 py-6 text-lg font-semibold"
                    onClick={() => window.location.href = 'tel:+6285880789045'}
                  >
                    <Phone className="mr-2" size={20} />
                    Call Now
                  </Button>
                </div>

                <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground">
                    💡 <span className="text-primary font-medium">Fun Fact:</span> 
                    I usually respond to emails within 24 hours and am always enthusiastic 
                    about discussing challenging projects!
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;