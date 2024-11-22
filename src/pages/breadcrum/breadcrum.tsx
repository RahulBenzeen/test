import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

// Define the structure of a breadcrumb item
interface BreadcrumbItem {
  label: string;
  to: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export function Breadcrumbs({ items = [] }: BreadcrumbsProps) {
  const location = useLocation();

  // Paths where breadcrumbs should not be displayed
  const excludedPaths = ['/', '/signin', '/register'];

  // Hide breadcrumbs for excluded paths
  if (excludedPaths.includes(location.pathname)) {
    return null;
  }

  // Generate breadcrumbs based on the current path if no items are provided
  const breadcrumbs = items.length > 0 ? items : generateBreadcrumbs(location.pathname);

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex items-center space-x-2">
        {/* Home link */}
        <li>
          <Link
            to="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {/* Breadcrumb items */}
        {breadcrumbs.map((item, index) => (
          <li key={item.to} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            {index === breadcrumbs.length - 1 ? (
              <span
                className="ml-2 font-medium text-foreground"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.to}
                className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Helper function to generate breadcrumbs dynamically
function generateBreadcrumbs(path: string): BreadcrumbItem[] {
  // Split the path into parts, ignoring empty parts caused by slashes
  const parts = path.split('/').filter(Boolean);

  // Map each part to a breadcrumb item
  return parts.map((part, index) => ({
    // Capitalize each word in the label
    label: part
      .replace(/[-_]/g, ' ') // Replace dashes and underscores with spaces
      .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase()), // Capitalize each word
    // Construct the path up to the current part
    to: '/' + parts.slice(0, index + 1).join('/'),
  }));
}

export default Breadcrumbs;
