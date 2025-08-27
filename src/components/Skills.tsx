import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  Database, 
  Globe, 
  BarChart3, 
  Settings, 
  Palette 
} from 'lucide-react';

const Skills = () => {
  const skillCategories = [
    {
      title: 'Backend Development',
      icon: <Code size={24} />,
      skills: ['PHP', 'Laravel'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Frontend Development', 
      icon: <Globe size={24} />,
      skills: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Vue.js', 'Bootstrap'],
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Data Engineering',
      icon: <BarChart3 size={24} />,
      skills: ['ETL Processes', 'Data Pipeline Development', 'Data Modeling', 'Data Warehousing'],
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Databases',
      icon: <Database size={24} />,
      skills: ['MySQL', 'phpMyAdmin', 'Database Management & Administration'],
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Data Analysis & ML',
      icon: <Settings size={24} />,
      skills: ['Python', 'Jupyter Notebook', 'NumPy', 'Scikit-learn', 'Data Visualization'],
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Tools & Others',
      icon: <Palette size={24} />,
      skills: ['Git', 'REST API', 'SAP Analytics Cloud', 'Figma'],
      color: 'from-pink-500 to-pink-600'
    }
  ];

  return (
    <section id="skills" className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Keahlian</span> Teknis
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Teknologi dan tools yang saya kuasai untuk mengembangkan solusi inovatif
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-glow mx-auto rounded-full mt-6"></div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <Card 
              key={category.title}
              className="card-glass p-6 group"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-center mb-6">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${category.color} text-white mr-4 group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground">{category.title}</h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <Badge 
                    key={skill}
                    variant="secondary"
                    className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors duration-200 px-3 py-1"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;