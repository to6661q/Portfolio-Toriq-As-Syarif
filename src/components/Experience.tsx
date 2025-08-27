import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Building } from 'lucide-react';

const Experience = () => {
  const experiences = [
    {
      title: 'Website Developer',
      company: 'PP-IPPAT (Pengurus Pusat Ikatan Pejabat Pembuat Akta Tanah)',
      period: '10 Maret 2024 - 23 Agustus 2024',
      location: 'Jakarta',
      type: 'Full-time',
      description: [
        'Perform regular monitoring of website performance, security, and availability to ensure high uptime and optimal responsiveness.',
        'Identify and proactively address technical issues, bugs, or errors that arise on the website.',
        'Perform content updates and implement minor features as needed by the organization.',
        'Manage and update the website database to ensure the integrity of content and user data.'
      ],
      tools: ['Website Maintenance', 'CMS', 'Web Security', 'MySQL', 'phpMyAdmin', 'PHP']
    },
    {
      title: 'Internship - Website Developer & IT Support',
      company: 'Diskominfo Serang',
      period: '3 Desember 2021 - 31 Januari 2022',
      location: 'Serang',
      type: 'Internship',
      description: [
        'Designed, managed, and normalized databases for multiple government websites, ensuring data integrity and efficiency.',
        'Monitored and maintained servers to guarantee service availability.'
      ],
      tools: ['PHP', 'Laravel', 'MySQL', 'HTML', 'CSS', 'Bootstrap', 'React.js', 'Vue.js']
    },
    {
      title: 'Training - Cybersecurity Operations',
      company: 'Digital Talent Scholarship KOMINFO & Cisco Networking Academy',
      period: '11 Juli 2022 - 11 Agustus 2022',
      location: 'Online',
      type: 'Training',
      description: [
        'Comprehensive program covering Security Operations Center (SOC) procedures, endpoint security and analysis, digital forensics, and incident response.',
        'Learned to analyze network intrusion data to identify compromised hosts and attack artifacts, applying incident response models to manage network security incidents.',
        'Gained proficiency in understanding the tactics, techniques, and procedures (TTP) used by cybercriminals, alongside the core security principles of confidentiality, integrity, and availability (CIA).',
        'Acquired practical skills in configuring and utilizing security tools on both Windows and Linux operating systems to detect and manage network attacks, along with understanding various network protocols.'
      ],
      tools: ['SIEM', 'Network Protocol Analyzers (Wireshark)', 'IDS/IPS (Snort)', 'Packet Tracer', 'Virtual Machines']
    },
    {
      title: 'Training - Data Engineer',
      company: 'Cisco Networking Academy',
      period: '19 Juli 2021 - 9 September 2021',
      location: 'Online',
      type: 'Training',
      description: [
        'Analyzed IoT sensor datasets to detect anomalies.',
        'Applied Python to preprocess and visualize time-series data, identifying patterns and key insights.',
        'Designed and implemented end-to-end data pipelines for fictional sales data analysis.',
        'Extract: Collected and parsed data from multiple sources (CSV, JSON) using Python scripts.',
        'Transform: Loaded processed data into SQL databases for reporting and analysis.',
        'Load: Loaded processed data into SQL databases for reporting and analysis.'
      ],
      tools: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'SQL', 'Jupyter Notebook']
    }
  ];

  return (
    <section id="experience" className="section-padding bg-gradient-to-b from-background to-card/30">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Pengalaman</span> Kerja
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Perjalanan profesional saya dalam pengembangan teknologi dan keamanan siber
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-glow mx-auto rounded-full mt-6"></div>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary-muted to-transparent"></div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div 
                key={index}
                className={`relative flex items-start ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex-col md:items-center`}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg z-10"></div>

                {/* Content card */}
                <Card className={`card-glass p-6 w-full md:w-5/12 ml-12 md:ml-0 ${
                  index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{exp.title}</h3>
                      <div className="flex items-center text-muted-foreground mb-2">
                        <Building size={16} className="mr-2" />
                        <span className="text-sm">{exp.company}</span>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary"
                      className={`${
                        exp.type === 'Full-time' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        exp.type === 'Internship' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        'bg-purple-500/20 text-purple-400 border-purple-500/30'
                      }`}
                    >
                      {exp.type}
                    </Badge>
                  </div>

                  <div className="flex items-center text-muted-foreground mb-2">
                    <Calendar size={16} className="mr-2" />
                    <span className="text-sm">{exp.period}</span>
                  </div>

                  <div className="flex items-center text-muted-foreground mb-4">
                    <MapPin size={16} className="mr-2" />
                    <span className="text-sm">{exp.location}</span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {exp.description.map((desc, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        {desc}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {exp.tools.map((tool) => (
                      <Badge 
                        key={tool}
                        variant="outline"
                        className="bg-primary/5 text-primary border-primary/20 text-xs"
                      >
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;