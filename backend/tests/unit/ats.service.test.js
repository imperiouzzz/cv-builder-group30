const { computeAtsScore, matchJobDescription } = require('../../src/services/ats.service');

describe('computeAtsScore', () => {
  it('returns 10 for completely empty CV', () => {
    expect(computeAtsScore({})).toBe(10);
  });

  it('scores higher with more sections filled', () => {
    const partial = { fullName: 'John Doe', email: 'john@example.com' };
    const full = {
      fullName: 'John Doe', jobTitle: 'Engineer', email: 'john@example.com',
      phone: '+233201234567', linkedin: 'https://linkedin.com/in/john',
      summary: 'Experienced software engineer with 5+ years building scalable applications using React and Node.js. Led teams and delivered projects on time.',
      education: [{ degree: 'BSc Computer Science', institution: 'KNUST' }],
      workExp: [{ title: 'Engineer', company: 'Acme', description: '• Built and deployed REST APIs\n• Reduced load time by 40%\n• Led a team of 5 engineers' }],
      skills: [{ name: 'Python' },{ name: 'React' },{ name: 'Node.js' },{ name: 'PostgreSQL' },{ name: 'Docker' },{ name: 'Git' },{ name: 'AWS' },{ name: 'TypeScript' }],
    };
    expect(computeAtsScore(full)).toBeGreaterThan(computeAtsScore(partial));
  });

  it('never exceeds 100', () => {
    const maxed = {
      fullName: 'A B', jobTitle: 'Dev', email: 'a@b.com', phone: '1234567890',
      linkedin: 'x', github: 'x',
      summary: 'A'.repeat(300),
      education: [{ degree: 'BSc', institution: 'KNUST' }],
      workExp: Array(5).fill({ title: 'Dev', company: 'Co', description: 'Built and deployed applications, reduced costs by 30%, led team of 10 engineers, implemented new systems' }),
      skills: Array(15).fill(null).map((_,i) => ({ name: 'Skill'+i })),
    };
    expect(computeAtsScore(maxed)).toBeLessThanOrEqual(100);
  });

  it('rewards action verbs and quantified achievements', () => {
    const withImpact = {
      fullName: 'A B', email: 'a@b.com',
      workExp: [{ description: 'Led a team of 5, reduced costs by 40%, deployed 3 production systems, improved performance by 60%' }],
    };
    const withoutImpact = {
      fullName: 'A B', email: 'a@b.com',
      workExp: [{ description: 'Was responsible for various tasks in the team environment' }],
    };
    expect(computeAtsScore(withImpact)).toBeGreaterThan(computeAtsScore(withoutImpact));
  });
});

describe('matchJobDescription', () => {
  const cv = {
    summary: 'Python developer with Django REST Framework experience',
    jobTitle: 'Backend Developer',
    skills: [{ name: 'Python' }, { name: 'Django' }, { name: 'PostgreSQL' }],
    workExp: [{ title: 'Intern', description: 'Built APIs using Django REST Framework and PostgreSQL' }],
    education: [{ degree: 'BSc Computer Science' }],
    projects: [],
  };

  it('returns a score between 0 and 100', () => {
    const result = matchJobDescription(cv, 'Looking for a Python developer with Django and PostgreSQL experience');
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('returns matched and missing keyword arrays', () => {
    const result = matchJobDescription(cv, 'Python Django PostgreSQL React TypeScript AWS');
    expect(result.matched).toBeInstanceOf(Array);
    expect(result.missing).toBeInstanceOf(Array);
    expect(result.matched).toContain('python');
    expect(result.missing).toContain('react');
  });

  it('scores higher when CV matches JD closely', () => {
    const highMatch = matchJobDescription(cv, 'Python Django REST Framework PostgreSQL backend developer intern');
    const lowMatch  = matchJobDescription(cv, 'Java Spring Boot Kubernetes AWS cloud architect enterprise');
    expect(highMatch.score).toBeGreaterThan(lowMatch.score);
  });
});
