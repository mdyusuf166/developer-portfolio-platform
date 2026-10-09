import { PageMeta } from '../components/common/PageMeta';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { usePublicPortfolio } from '../hooks/usePublicPortfolio';

export function SkillsPage() {
  const { profile } = usePublicPortfolio();
  return (
    <>
      <PageMeta title="Skills" description="Areas of focus across machine learning, generative AI, software engineering, cybersecurity, and research." />

      <section className="space-y-8 py-8 md:py-12">
        <div className="space-y-4">
          <p className="eyebrow">Skills</p>
          <h1 className="section-title">Technical focus areas and engineering interests.</h1>
          <p className="section-copy">These areas describe current focus and interests, not a claim of mastery or professional experience.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {profile.skills.map((group) => (
            <Card key={group.category} className="h-full transition-transform duration-200 hover:-translate-y-1 hover:shadow-soft">
              <CardHeader>
                <CardTitle>{group.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
