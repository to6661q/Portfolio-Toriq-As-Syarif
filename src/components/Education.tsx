import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Award, FileText, BookOpen, School } from 'lucide-react';

const Education = () => {
  const educationLevels = [
    {
      level: 'University',
      school: 'Syarif Hidayatullah State Islamic University Jakarta',
      degree: 'Bachelor of Informatics Engineering',
      period: '2018 - 2023',
      gpa: '3.84 / 4.00',
      icon: GraduationCap,
      color: 'from-primary to-primary-glow',
      details: {
        thesis: 'Optimization of Outlier Handling in Datasets for Machine Maintenance Prediction Using Machine Learning with the Addition of New Variables',
        focus: 'Machine Learning, Data Science, Cybersecurity',
        research: 'Outlier Detection & Predictive Maintenance'
      }
    },
    {
      level: 'High School',
      school: 'SMAN 1 Ciputat',
      degree: 'Science Major',
      period: '2015 - 2018',
      gpa: '85.2 / 100',
      icon: School,
      color: 'from-blue-500 to-blue-600',
      details: {
        focus: 'Mathematics, Physics, Chemistry',
        achievement: 'Mathematics Olympiad Participant'
      }
    },
    {
      level: 'Junior High School',
      school: 'SMPN 2 Ciputat',
      degree: 'General Education',
      period: '2012 - 2015',
      gpa: '88.5 / 100',
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
      details: {
        achievement: 'Student Council Member',
        focus: 'Academic Excellence'
      }
    },
    {
      level: 'Elementary School',
      school: 'SDN Ciputat 1',
      degree: 'Primary Education',
      period: '2006 - 2012',
      gpa: '90.0 / 100',
      icon: BookOpen,
      color: 'from-yellow-500 to-yellow-600',
      details: {
        achievement: 'Class Representative',
        focus: 'Foundation Learning'
      }
    },
    {
      level: 'Kindergarten',
      school: 'TK Pembina Ciputat',
      degree: 'Early Childhood Education',
      period: '2004 - 2006',
      gpa: 'Excellent',
      icon: BookOpen,
      color: 'from-pink-500 to-pink-600',
      details: {
        achievement: 'Outstanding Student',
        focus: 'Basic Skills Development'
      }
    }
  ];

  return (
    <section id="education" className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Education</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Academic background and achievements in Informatics Engineering and foundational education
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-glow mx-auto rounded-full mt-6"></div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {educationLevels.map((edu, index) => (
            <Card key={index} className="card-glass p-8">
              <div className="grid md:grid-cols-4 gap-8 items-center">
                {/* Institution Info */}
                <div className="md:col-span-3">
                  <div className="flex items-center mb-6">
                    <div className={`p-4 bg-gradient-to-r ${edu.color} rounded-lg mr-6`}>
                      <edu.icon size={32} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {edu.degree}
                      </h3>
                      <p className="text-lg text-muted-foreground mb-1">
                        {edu.school}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {edu.period}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  {edu.level === 'University' && edu.details.thesis && (
                    <div className="bg-primary/5 rounded-lg p-6 border border-primary/20 mb-6">
                      <div className="flex items-start mb-4">
                        <FileText className="text-primary mr-3 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <h4 className="text-lg font-semibold text-foreground mb-2">Thesis Title</h4>
                          <p className="text-muted-foreground leading-relaxed">
                            <span className="text-primary font-medium">
                              "{edu.details.thesis}"
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {edu.details.focus && (
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                        <span className="text-muted-foreground">
                          <span className="text-primary font-medium">Focus:</span> {edu.details.focus}
                        </span>
                      </div>
                    )}
                    {edu.details.research && (
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                        <span className="text-muted-foreground">
                          <span className="text-primary font-medium">Research:</span> {edu.details.research}
                        </span>
                      </div>
                    )}
                    {edu.details.achievement && (
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                        <span className="text-muted-foreground">
                          <span className="text-primary font-medium">Achievement:</span> {edu.details.achievement}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* GPA Section */}
                <div className="text-center">
                  <div className={`bg-gradient-to-r ${edu.color} p-8 rounded-xl text-white mb-6`}>
                    <Award size={48} className="mx-auto mb-4" />
                    <div className="text-4xl font-bold mb-2">{edu.gpa.split(' /')[0]}</div>
                    <div className="text-lg opacity-90">
                      {edu.gpa.includes('/') ? `GPA / ${edu.gpa.split('/ ')[1]}` : edu.gpa}
                    </div>
                  </div>

                  <Badge 
                    variant="secondary"
                    className={`${
                      edu.level === 'University' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      edu.level === 'High School' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                      edu.level === 'Junior High School' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      edu.level === 'Elementary School' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                      'bg-pink-500/20 text-pink-400 border-pink-500/30'
                    } px-4 py-2 text-sm font-semibold`}
                  >
                    {edu.level}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;