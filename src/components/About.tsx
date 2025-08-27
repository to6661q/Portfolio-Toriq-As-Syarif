import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const About = () => {
  const softSkills = [
    'Adaptable',
    'Communicative', 
    'Disciplined',
    'Respectful',
    'Responsible',
    'Teamwork'
  ];

  return (
    <section id="about" className="section-padding bg-gradient-to-b from-background to-card/30">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Tentang <span className="gradient-text">Saya</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-glow mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Card className="card-glass p-8">
              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                I have a Bachelor's Degree in <span className="text-primary font-semibold">Informatics Engineering</span> based in Jakarta, 
                with passion for android, cybersecurity, data science, machine learning, multimedia, and networking.
              </p>
              
              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                I also capabilities for deep learning and software prediction modelling with my final thesis about 
                <span className="text-primary font-semibold"> optimization of outlier handling in datasets for machine maintenance prediction</span> using 
                machine learning with the addition of new variables.
              </p>
              
              <p className="text-lg leading-relaxed text-muted-foreground">
                I have gained practical experience through involvement in organizational committees, IT events, 
                and application development projects all of which comprehensively support my expertise in 
                <span className="text-primary font-semibold"> information technology</span>.
              </p>
            </Card>
          </div>

          <div>
            <Card className="card-glass p-8">
              <h3 className="text-2xl font-bold mb-6 gradient-text">Soft Skills</h3>
              <div className="grid grid-cols-2 gap-4">
                {softSkills.map((skill, index) => (
                  <div 
                    key={skill} 
                    className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg border border-primary/20 hover:bg-primary/10 transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CheckCircle className="text-primary flex-shrink-0" size={20} />
                    <span className="text-foreground font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;