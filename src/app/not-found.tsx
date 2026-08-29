import { NotFoundPage } from '../views/NotFoundPage';

export const metadata = {
  title: '404 — Page Not Found',
  description: 'The requested handloom page or collection could not be found.',
};

export default function NotFound() {
  return <NotFoundPage />;
}
