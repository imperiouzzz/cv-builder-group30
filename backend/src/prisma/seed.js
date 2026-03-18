/**
 * Prisma Seed Script
 * Run: npm run db:seed
 *
 * Creates a demo user + sample CV so the app is usable immediately
 * after `prisma migrate dev`.
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱  Seeding database…');

  // ── Demo user ──────────────────────────────────────────────
  const hashed = await bcrypt.hash('demo1234', 12);
  const user = await prisma.user.upsert({
    where:  { email: 'demo@cvbuilder.knust' },
    update: {},
    create: { email: 'demo@cvbuilder.knust', password: hashed },
  });
  console.log(`✅  Demo user: demo@cvbuilder.knust  /  demo1234`);

  // ── Sample CV ──────────────────────────────────────────────
  const existing = await prisma.cV.findFirst({ where: { userId: user.id } });
  if (existing) {
    console.log('ℹ️   Sample CV already exists — skipping.');
    return;
  }

  await prisma.cV.create({
    data: {
      userId:   user.id,
      title:    'Backend Developer CV',
      template: 'classic',
      atsScore: 72,

      fullName: 'Okang-Mensah Maurus',
      jobTitle: 'Backend Developer',
      email:    'maurusokangmensah@gmail.com',
      phone:    '0535603362',
      linkedin: 'https://linkedin.com/in/maurus-okang-mensah-936b13354',
      github:   '',

      summary: 'Self-motivated and detail-oriented Computer Science student at KNUST, expected to graduate in 2027. Hands-on experience with Python, Django REST Framework, TensorFlow, and OpenCV. Strong analytical thinking and collaborative work ethic developed through internships at Bsystems Limited and Fidelity Bank Ghana.',

      sectionOrder: JSON.stringify(['summary','education','work','skills','projects','volunteering','references']),

      education: {
        create: [
          {
            degree:       'BSc. Computer Science',
            institution:  'Kwame Nkrumah University of Science and Technology (KNUST)',
            location:     'Kumasi, Ghana',
            startDate:    '',
            endDate:      'September 2027',
            gpa:          '',
            achievements: '',
            sortOrder:    0,
          },
          {
            degree:       'W.A.S.S.C.E (Science)',
            institution:  'Mfantsipim School',
            location:     'Cape Coast, Central Region',
            startDate:    'September 2020',
            endDate:      'September 2023',
            gpa:          '',
            achievements: '',
            sortOrder:    1,
          },
        ],
      },

      workExp: {
        create: [
          {
            title:       'Intern',
            company:     'Bsystems Limited',
            location:    '',
            startDate:   'September 2024',
            endDate:     'October 2024',
            description: '• Built and maintained REST APIs using Django REST Framework\n• Assisted with data modeling, view logic, and endpoint testing\n• Collaborated with developers on real-world projects\n• Participated in debugging sessions and code reviews',
            sortOrder:   0,
          },
          {
            title:       'Intern, Information Technology Unit',
            company:     'Fidelity Bank Ghana, Head Office',
            location:    'Accra, Ghana',
            startDate:   'November 2024',
            endDate:     'December 2024',
            description: '• Configured cloud computing services, DHCP, DNS, and server management\n• Provided remote and on-site hardware and software support\n• Gained experience in HSM, key management, and penetration testing\n• Configured VLANs, VLSM, and trunk/access ports\n• Contributed to facial recognition system development using TensorFlow and OpenCV',
            sortOrder:   1,
          },
        ],
      },

      skills: {
        create: [
          { name: 'Python',                 category: 'technical', sortOrder: 0 },
          { name: 'Django REST Framework',  category: 'technical', sortOrder: 1 },
          { name: 'Git',                    category: 'tool',      sortOrder: 2 },
          { name: 'Postman',                category: 'tool',      sortOrder: 3 },
          { name: 'Cisco Packet Tracer',    category: 'tool',      sortOrder: 4 },
          { name: 'TensorFlow',             category: 'technical', sortOrder: 5 },
          { name: 'Jupyter Notebook',       category: 'tool',      sortOrder: 6 },
          { name: 'MySQL',                  category: 'technical', sortOrder: 7 },
          { name: 'Leadership',             category: 'soft',      sortOrder: 8 },
          { name: 'Teamwork',               category: 'soft',      sortOrder: 9 },
          { name: 'Problem Solving',        category: 'soft',      sortOrder: 10 },
          { name: 'Communication',          category: 'soft',      sortOrder: 11 },
        ],
      },

      volunteering: {
        create: [
          {
            role:      'Group Leader',
            org:       'HOSA Camp Expedition',
            period:    '',
            desc:      'Led a team of participants through camp activities, ensuring coordination and collaboration. Represented the group during presentations and feedback sessions.',
            sortOrder: 0,
          },
          {
            role:      'Logistics Head',
            org:       'Mfantsipim Computer and Robotics Club (MCRC)',
            period:    '',
            desc:      'Coordinated logistics for club activities including workshops, meetings, and events. Managed equipment setup and resource planning.',
            sortOrder: 1,
          },
        ],
      },

      references: {
        create: [
          {
            name:      'Abiola Olabiyi',
            title:     'System Administrator — Infrastructure',
            org:       'OSTEC / Fidelity Bank Limited Ghana',
            email:     '',
            phone:     '+233501603188',
            sortOrder: 0,
          },
          {
            name:      'Rainer Bielert',
            title:     'Software Developer',
            org:       'Bsystems Limited',
            email:     'bielertwreiner@gmail.com',
            phone:     '+233530826193',
            sortOrder: 1,
          },
        ],
      },
    },
  });

  console.log('✅  Sample CV created for demo user.');
  console.log('\n🚀  Seed complete! Log in with:');
  console.log('    Email:    demo@cvbuilder.knust');
  console.log('    Password: demo1234\n');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
