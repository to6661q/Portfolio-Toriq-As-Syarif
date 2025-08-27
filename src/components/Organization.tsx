import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Award, Target, Briefcase } from 'lucide-react';

const Organization = () => {
  const organizationExperience = [
    {
      role: 'Committee Member',
      organization: 'IT Event Committee',
      period: '2022 - 2023',
      type: 'Event Management',
      description: 'Actively participated in organizing technology events, seminars, and workshops for the university community.',
      responsibilities: [
        'Coordinated technical workshops and seminars',
        'Managed event logistics and participant registration',
        'Collaborated with industry professionals for guest speakers',
        'Handled multimedia content creation for event promotion'
      ],
      skills: ['Event Planning', 'Team Coordination', 'Public Relations', 'Project Management'],
      icon: <Users size={24} />
    },
    {
      role: 'Application Development Team',
      organization: 'University Tech Projects',
      period: '2021 - 2022',
      type: 'Development Team',
      description: 'Contributed to various application development projects that served the academic community.',
      responsibilities: [
        'Developed web-based applications for academic use',
        'Participated in code reviews and testing phases',
        'Collaborated on database design and implementation',
        'Documented development processes and user guides'
      ],
      skills: ['Team Development', 'Code Collaboration', 'Database Design', 'Documentation'],
      icon: <Briefcase size={24} />
    },
    {
      role: 'Technical Support Volunteer',
      organization: 'Campus Digital Initiatives',
      period: '2020 - 2021',
      type: 'Volunteer Work',
      description: 'Provided technical support for various campus digitalization projects and student tech needs.',
      responsibilities: [
        'Assisted students with technical issues and software installation',
        'Supported faculty with digital tools and platforms',
        'Maintained computer lab equipment and software',
        'Created technical guides and tutorials for common issues'
      ],
      skills: ['Technical Support', 'Problem Solving', 'Communication', 'Training'],
      icon: <Target size={24} />
    }
  ];

  const achievements = [
    {
      title: 'Outstanding Contributor',
      organization: 'IT Event Committee',
      year: '2023',
      description: 'Recognized for exceptional contribution to successful technology events'
    },
    {
      title: 'Best Team Collaboration',
      organization: 'University Tech Projects',
      year: '2022',
      description: 'Awarded for excellent teamwork in application development projects'
    },
    {
      title: 'Volunteer Excellence',
      organization: 'Campus Digital Initiatives',
      year: '2021',
      description: 'Appreciated for dedicated service in campus technical support'
    }
  ];

  return (
    <section id="organization" className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Organization</span> Experience
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Active involvement in organizational committees, IT events, and collaborative projects 
            that enhanced my leadership, teamwork, and technical skills.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-glow mx-auto rounded-full mt-6"></div>
        </div>

        {/* Organization Experience */}
        <div className="space-y-8 mb-16">
          {organizationExperience.map((org, index) => (
            <Card key={index} className="card-glass p-8 hover:scale-[1.02] transition-all duration-300">
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Icon and Basic Info */}
                <div className="lg:col-span-1">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-r from-primary to-primary-glow text-white mr-4">
                      {org.icon}
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-2">{org.type}</Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar size={16} className="mr-2" />
                        {org.period}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-foreground mb-1">{org.role}</h3>
                    <p className="text-primary font-semibold mb-3">{org.organization}</p>
                    <p className="text-muted-foreground leading-relaxed">{org.description}</p>
                  </div>

                  {/* Responsibilities */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-foreground mb-3">Key Responsibilities:</h4>
                    <ul className="grid md:grid-cols-2 gap-2">
                      {org.responsibilities.map((responsibility, idx) => (
                        <li key={idx} className="flex items-start text-sm text-muted-foreground">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          {responsibility}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Skills Developed:</h4>
                    <div className="flex flex-wrap gap-2">
                      {org.skills.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="border-primary/30 text-primary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Achievements */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-8">
            <span className="gradient-text">Achievements</span> & Recognition
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="card-glass p-6 text-center hover:scale-105 transition-all duration-300">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award size={24} className="text-white" />
                  </div>
                  <h4 className="font-bold text-foreground mb-2">{achievement.title}</h4>
                  <p className="text-primary font-semibold text-sm mb-1">{achievement.organization}</p>
                  <p className="text-muted-foreground text-sm mb-3">{achievement.year}</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {achievement.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">3+</div>
            <div className="text-sm text-muted-foreground">Organizations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">5+</div>
            <div className="text-sm text-muted-foreground">Projects Led</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">10+</div>
            <div className="text-sm text-muted-foreground">Events Organized</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">3</div>
            <div className="text-sm text-muted-foreground">Awards Received</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Organization;