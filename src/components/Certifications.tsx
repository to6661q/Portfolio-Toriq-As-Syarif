import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Calendar, ExternalLink } from 'lucide-react';

const Certifications = () => {
  const certifications = [
    {
      title: 'SAP Analytics Cloud',
      provider: 'ASEAN Data Science Explorers',
      date: 'May 2023',
      category: 'Analytics',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Cyber Security Operation',
      provider: 'Digital Talent Scholarship FGA KOMINFO',
      date: 'August 2022',
      category: 'Security',
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'CyberOps Associate',
      provider: 'Cisco Networking Academy',
      date: 'August 2022',
      category: 'Security',
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Cybersecurity Essentials',
      provider: 'Cisco Networking Academy',
      date: 'August 2022',
      category: 'Security',
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'CISCO - Big Data using Python',
      provider: 'Digital Talent Scholarship FGA KOMINFO',
      date: 'October 2021',
      category: 'Data Science',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'IoT Fundamentals Big Data and Analytics',
      provider: 'Cisco Networking Academy',
      date: 'September 2021',
      category: 'IoT',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'PCAP Programming Essentials in Python',
      provider: 'Python Institute',
      date: 'August 2021',
      category: 'Programming',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'CCNA Cybersecurity Operations',
      provider: 'Cisco Networking Academy',
      date: 'January 2021',
      category: 'Security',
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Blockchain Essentials',
      provider: 'Cognitive Class',
      date: 'November 2020',
      category: 'Blockchain',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'Routing and Switching',
      provider: 'HUAWEI',
      date: 'July 2020',
      category: 'Networking',
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'UX Designer Digital Product Development',
      provider: 'Skill Academy',
      date: 'March 2020',
      category: 'Design',
      color: 'from-pink-500 to-pink-600'
    },
    {
      title: 'CIDDF - Certified International Data Development Fundamentals',
      provider: 'PASAS Purchasing and Supply Association (Singapore)',
      date: 'January 2020',
      category: 'Data',
      color: 'from-teal-500 to-teal-600'
    },
    {
      title: 'MTCNA - MikroTik Certified Network Associate',
      provider: 'MikroTiK',
      date: 'November 2019',
      category: 'Networking',
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'CIDDF - Certified International Data Development Fundamentals',
      provider: 'Cybernext Data Academy',
      date: 'November 2019',
      category: 'Data',
      color: 'from-teal-500 to-teal-600'
    },
    {
      title: 'MTCSA - MikroTik Certified Security Associate',
      provider: 'Cybernext Data Academy',
      date: 'October 2019',
      category: 'Security',
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Microsoft Technology Associate (MTA) Software Development Fundamentals',
      provider: 'Multimedia',
      date: 'September 2018',
      category: 'Programming',
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  const categories = [
    { name: 'Security', count: certifications.filter(c => c.category === 'Security').length },
    { name: 'Data Science', count: certifications.filter(c => c.category === 'Data Science').length },
    { name: 'Programming', count: certifications.filter(c => c.category === 'Programming').length },
    { name: 'Networking', count: certifications.filter(c => c.category === 'Networking').length },
    { name: 'Analytics', count: certifications.filter(c => c.category === 'Analytics').length },
    { name: 'Others', count: certifications.filter(c => !['Security', 'Data Science', 'Programming', 'Networking', 'Analytics'].includes(c.category)).length }
  ];

  return (
    <section id="certifications" className="section-padding bg-gradient-to-b from-background to-card/30">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Sertifikasi</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sertifikat profesional yang menunjukkan komitmen saya terhadap pembelajaran berkelanjutan
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-glow mx-auto rounded-full mt-6"></div>
        </div>

        {/* Category Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {categories.map((category, index) => (
            <Card key={category.name} className="card-glass p-4 text-center">
              <div className="text-2xl font-bold gradient-text mb-2">{category.count}</div>
              <div className="text-sm text-muted-foreground">{category.name}</div>
            </Card>
          ))}
        </div>

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <Card 
              key={index}
              className="card-glass p-6 group hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${cert.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                  <Award size={24} />
                </div>
                <Badge 
                  variant="secondary"
                  className={`${
                    cert.category === 'Security' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    cert.category === 'Data Science' || cert.category === 'Data' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    cert.category === 'Programming' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                    cert.category === 'Networking' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                    cert.category === 'Analytics' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                    'bg-purple-500/20 text-purple-400 border-purple-500/30'
                  } text-xs`}
                >
                  {cert.category}
                </Badge>
              </div>

              <h3 className="text-lg font-bold text-foreground mb-3 leading-tight">
                {cert.title}
              </h3>

              <p className="text-muted-foreground mb-4 text-sm">
                {cert.provider}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-muted-foreground text-sm">
                  <Calendar size={16} className="mr-2" />
                  {cert.date}
                </div>
                <ExternalLink 
                  size={16} 
                  className="text-muted-foreground hover:text-primary transition-colors cursor-pointer" 
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;