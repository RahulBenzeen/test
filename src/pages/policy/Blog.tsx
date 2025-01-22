
import { Card, CardContent  } from '../../components/ui/card';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of E-commerce: Trends to Watch',
    excerpt: 'Discover the latest trends shaping the future of online shopping and what it means for consumers.',
    author: 'John Smith',
    date: 'March 15, 2024',
    category: 'Industry Trends',
    imageUrl: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    title: 'Sustainable Shopping: Making Better Choices',
    excerpt: 'Learn how to make environmentally conscious shopping decisions without compromising on quality.',
    author: 'Emma Davis',
    date: 'March 12, 2024',
    category: 'Sustainability',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    title: `Tech Gadgets: What's Hot in 2024`,
    excerpt: 'A comprehensive guide to the most exciting tech gadgets and innovations of the year.',
    author: 'Michael Chen',
    date: 'March 10, 2024',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '4',
    title: 'Fashion Forward: Spring Collection Preview',
    excerpt: 'Get a sneak peek at the upcoming spring fashion trends and must-have pieces.',
    author: 'Sarah Johnson',
    date: 'March 8, 2024',
    category: 'Fashion',
    imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '5',
    title: 'Home Decor Tips for Every Season',
    excerpt: 'Expert advice on how to keep your home looking fresh and stylish throughout the year.',
    author: 'Lisa Brown',
    date: 'March 5, 2024',
    category: 'Home & Living',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '6',
    title: 'Customer Success Stories: Real Experiences',
    excerpt: 'Read inspiring stories from our customers and their journey with our products.',
    author: 'David Wilson',
    date: 'March 3, 2024',
    category: 'Customer Stories',
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
  }
];

export default function Blog() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-8">Our Blog</h1>

      <div className="grid gap-8">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 text-center max-w-2xl mx-auto">
                Stay updated with the latest trends, industry insights, and helpful tips from our experts. 
                Discover everything from fashion advice to tech reviews and sustainable shopping guides.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author}
                  </span>
                </div>
                <h2 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                  <Link to={`/blog/${post.id}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">{post.category}</span>
                  <Link
                    to={`/blog/${post.id}`}
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    Read More <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}