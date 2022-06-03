import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGithub,
  faStackOverflow,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons';
import { SubscriptionForm } from './subscription-form';
import { faAt } from '@fortawesome/pro-solid-svg-icons';

const navigation = {
  social: [
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/mavarazy/',
      icon: (props) => <FontAwesomeIcon icon={faLinkedin} {...props} />,
    },
    {
      name: 'Stack Overflow',
      href: 'https://stackoverflow.com/users/575338/mavarazy',
      icon: (props) => <FontAwesomeIcon icon={faStackOverflow} {...props} />,
    },
    {
      name: 'GitHub',
      href: 'https://github.com/mavarazy',
      icon: (props) => <FontAwesomeIcon icon={faGithub} {...props} />,
    },
    {
      name: 'Mailto',
      href: 'mailto:antono@clemble.com',
      icon: (props) => <FontAwesomeIcon icon={faAt} {...props} />,
    },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav
          className="-mx-5 -my-2 flex flex-wrap justify-center"
          aria-label="Footer"
        >
          <SubscriptionForm />
        </nav>
        <div className="mt-8 flex justify-center space-x-6">
          {navigation.social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-400 hover:text-brand"
              target="_blank"
              rel="noreferrer"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
