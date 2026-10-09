import { PageMeta } from '../components/common/PageMeta';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { usePublicPortfolio } from '../hooks/usePublicPortfolio';

export function AboutPage() {
  const { profile } = usePublicPortfolio();
  return (
    <>
      <PageMeta title="About" description="Meet MD Mahtab Ahmed Mahin, an AI / ML Engineer focused on intelligent systems and responsible engineering." />

      <section className="space-y-8 py-8 md:py-12">
        <div className="space-y-4">
          <p className="eyebrow">About</p>
          <h1 className="section-title">An engineering focus on intelligent systems.</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle>Identity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>I&apos;m {profile.name}, an {profile.title}. I&apos;m interested in building intelligent systems and machine learning applications with a sound software engineering foundation.</p>
              <p>This site will document project and research work when verified material is ready to share; it does not represent employment or production deployment experience.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI / ML interests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.aboutHighlights.map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Software engineering foundation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>My engineering interests include clear interfaces, maintainable architecture, and careful testing for intelligent applications.</p>
            <p>I am also interested in cybersecurity and AI security, alongside research in applied machine learning and generative AI.</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
