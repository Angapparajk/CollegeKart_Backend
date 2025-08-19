const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const College = require('./models/College');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/collegekart');

  await User.deleteMany();
  await Product.deleteMany();
  await College.deleteMany();

  const collegeNames = [
    'Anna University', 'IIT Madras', 'PSG College of Technology', 'SRM University', 'VIT Vellore', 'SASTRA University', 'Madras Institute of Technology', 'Coimbatore Institute of Technology', 'Thiagarajar College of Engineering', 'Government College of Technology', 'Kumaraguru College of Technology', 'Bannari Amman Institute of Technology', 'Sri Krishna College of Engineering', 'Velammal Engineering College', 'Rajalakshmi Engineering College', 'St. Joseph’s College of Engineering', 'Meenakshi Sundararajan Engineering College', 'Sri Sairam Engineering College', 'Saveetha Engineering College', 'Hindustan Institute of Technology', 'Sri Venkateswara College of Engineering', 'Jeppiaar Engineering College', 'Panimalar Engineering College', 'Easwari Engineering College', 'R.M.K. Engineering College', 'Sri Ramachandra Institute', 'Loyola College', 'Ethiraj College for Women', 'Women’s Christian College', 'DG Vaishnav College', 'MOP Vaishnav College', 'Guru Nanak College', 'New College', 'Pachaiyappa’s College', 'Presidency College', 'Queen Mary’s College', 'Madras Christian College', 'Stella Maris College', 'St. Xavier’s College', 'American College', 'Ayya Nadar Janaki Ammal College', 'Bishop Heber College', 'National College', 'Jamal Mohamed College', 'Kongu Engineering College', 'Karunya Institute of Technology', 'Dr. Mahalingam College', 'Sri Ramakrishna Engineering College', 'SNS College of Technology'
  ];
  const colleges = await College.insertMany(collegeNames.map((name, i) => ({ name, location: 'Tamil Nadu' })));

  const users = await User.insertMany([
    { name: 'Arun', email: 'arun@example.com', password: '$2a$10$abcdefghijklmnopqrstuv', college: colleges[0].name, contact: '9876543210' },
    { name: 'Priya', email: 'priya@example.com', password: '$2a$10$abcdefghijklmnopqrstuv', college: colleges[1].name, contact: '9123456780' },
    { name: 'Rahul', email: 'rahul@example.com', password: '$2a$10$abcdefghijklmnopqrstuv', college: colleges[2].name, contact: '9001234567' },
    { name: 'Sneha', email: 'sneha@example.com', password: '$2a$10$abcdefghijklmnopqrstuv', college: colleges[3].name, contact: '9012345678' },
    { name: 'Vikram', email: 'vikram@example.com', password: '$2a$10$abcdefghijklmnopqrstuv', college: colleges[4].name, contact: '9023456789' },
    { name: 'Admin', email: 'admin@collegekart.com', password: '$2a$10$abcdefghijklmnopqrstuv', college: 'Admin', contact: '9999999999', isAdmin: true }
  ]);

  const categories = ['Electronics', 'Books', 'Stationery', 'Sports', 'Furniture'];
  const images = {
    'Electronics': [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca'
    ],
    'Books': [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794',
      'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4',
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66'
    ],
    'Stationery': [
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
      'https://images.unsplash.com/photo-1503676382389-4809596d5290',
      'https://images.unsplash.com/photo-1464983953574-0892a716854b'
    ],
    'Sports': [
      'https://images.unsplash.com/photo-1517649763962-0c623066013b',
      'https://images.unsplash.com/photo-1509228468518-180dd4864904',
      'https://images.unsplash.com/photo-1519864600265-abbf9d1b7b1b'
    ],
    'Furniture': [
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
      'https://images.unsplash.com/photo-1505691723518-41cb85eea23e'
    ]
  };

  const products = [];
  for (let i = 0; i < 50; i++) {
    const category = categories[i % categories.length];
    const seller = users[i % users.length];
    const college = colleges[i % colleges.length];
    products.push({
      title: `${category} Product ${i + 1}`,
      description: `Sample ${category.toLowerCase()} product for college students.`,
      price: Math.floor(Math.random() * 5000) + 200,
      images: [images[category][i % 3]],
      seller: seller._id,
      college: college.name,
      category,
      status: 'available'
    });
  }
  await Product.insertMany(products);

  console.log('Sample data inserted');
  mongoose.disconnect();
}

seed();
