import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Award, FileText } from 'lucide-react';

const Education = () => {
  return (
    <section id="education" className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Pendidikan</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Latar belakang akademis dan pencapaian dalam bidang Teknik Informatika
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-glow mx-auto rounded-full mt-6"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="card-glass p-8">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* University Info */}
              <div className="md:col-span-2">
                <div className="flex items-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-primary to-primary-glow rounded-lg mr-6">
                    <GraduationCap size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Bachelor of Informatics Engineering
                    </h3>
                    <p className="text-lg text-muted-foreground">
                      Syarif Hidayatullah State Islamic University Jakarta
                    </p>
                  </div>
                </div>

                {/* Thesis */}
                <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
                  <div className="flex items-start mb-4">
                    <FileText className="text-primary mr-3 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-2">Judul Skripsi</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        <span className="text-primary font-medium">
                          "Optimization of Outlier Handling in Datasets for Machine Maintenance Prediction 
                          Using Machine Learning with the Addition of New Variables"
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* GPA Section */}
              <div className="text-center">
                <div className="bg-gradient-to-r from-primary to-primary-glow p-8 rounded-xl text-white mb-6">
                  <Award size={48} className="mx-auto mb-4" />
                  <div className="text-4xl font-bold mb-2">3.84</div>
                  <div className="text-lg opacity-90">GPA / 4.00</div>
                </div>

                <Badge 
                  variant="secondary"
                  className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2 text-sm font-semibold"
                >
                  Cumulative Grade Point Average
                </Badge>
              </div>
            </div>

            {/* Additional Details */}
            <div className="mt-8 pt-8 border-t border-border/20">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                  <span className="text-muted-foreground">
                    <span className="text-primary font-medium">Focus:</span> Machine Learning, Data Science, Cybersecurity
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                  <span className="text-muted-foreground">
                    <span className="text-primary font-medium">Research:</span> Outlier Detection & Predictive Maintenance
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Education;