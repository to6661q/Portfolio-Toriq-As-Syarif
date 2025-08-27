import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Github, ExternalLink, MapPin, Send } from 'lucide-react';

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
      label: 'Telepon',
      value: '(+62) 858-8078-9045',
      href: 'tel:+6285880789045',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <MapPin size={24} />,
      label: 'Lokasi',
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
      description: 'Lihat proyek dan kontribusi kode saya'
    },
    {
      icon: <ExternalLink size={24} />,
      label: 'LinkedIn',
      value: 'Connect with me',
      href: '#',
      description: 'Terhubung untuk peluang profesional'
    }
  ];

  return (
    <section id="contact" className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Mari <span className="gradient-text">Berkolaborasi</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Saya terbuka untuk kesempatan baru, proyek menarik, dan diskusi tentang teknologi. 
            Jangan ragu untuk menghubungi saya!
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-glow mx-auto rounded-full mt-6"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="card-glass p-6">
              <h3 className="text-xl font-bold mb-6 gradient-text">Informasi Kontak</h3>
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
              <h3 className="text-xl font-bold mb-6 gradient-text">Media Sosial</h3>
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

          {/* CTA Section */}
          <div className="lg:col-span-2">
            <Card className="card-glass p-8 h-full flex flex-col justify-center">
              <div className="text-center">
                <div className="mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Send size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Siap untuk Berkolaborasi?</h3>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    Saya selalu tertarik untuk mendengar tentang peluang baru, proyek inovatif, 
                    atau bahkan hanya untuk berdiskusi tentang teknologi dan tren industri terkini. 
                    Mari kita ciptakan sesuatu yang luar biasa bersama!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="btn-primary px-8 py-6 text-lg font-semibold"
                    onClick={() => window.location.href = 'mailto:toriqnain@gmail.com?subject=Mari Berkolaborasi!'}
                  >
                    <Mail className="mr-2" size={20} />
                    Kirim Email
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="btn-ghost px-8 py-6 text-lg font-semibold"
                    onClick={() => window.location.href = 'tel:+6285880789045'}
                  >
                    <Phone className="mr-2" size={20} />
                    Hubungi Sekarang
                  </Button>
                </div>

                <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground">
                    💡 <span className="text-primary font-medium">Fun Fact:</span> 
                    Saya biasanya merespons email dalam 24 jam dan selalu antusias 
                    membahas proyek-proyek yang menantang!
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