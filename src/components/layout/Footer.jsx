'use client';

import Link from 'next/link';
import {
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  Globe,
  Heart,
  ExternalLink
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'API', href: '/api' },
      { label: 'Integrations', href: '/integrations' }
    ],
    resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Tutorials', href: '/tutorials' },
      { label: 'Blog', href: '/blog' },
      { label: 'Community', href: '/community' }
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Status', href: '/status' },
      { label: 'Report Bug', href: '/bug-report' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'GDPR', href: '/gdpr' }
    ]
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Globe, href: 'https://tbm.com', label: 'Website' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Text Book Machine
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Transform your syllabi and raw documents into professionally structured books with AI-powered automation.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>support@tbm.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors duration-200 flex items-center space-x-1"
                  >
                    <span>{link.label}</span>
                    {link.href.startsWith('http') && (
                      <ExternalLink className="h-3 w-3" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Resources Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors duration-200 flex items-center space-x-1"
                  >
                    <span>{link.label}</span>
                    {link.href.startsWith('http') && (
                      <ExternalLink className="h-3 w-3" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors duration-200 flex items-center space-x-1"
                  >
                    <span>{link.label}</span>
                    {link.href.startsWith('http') && (
                      <ExternalLink className="h-3 w-3" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div>
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-sm text-gray-400">Books Generated</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">10K+</div>
              <div className="text-sm text-gray-400">Active Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">99.9%</div>
              <div className="text-sm text-gray-400">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>&copy; {currentYear} Text Book Machine. All rights reserved.</span>
              <span className="hidden sm:inline">|</span>
              <span className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-500 fill-current" />
                <span>for educators</span>
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Signup Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-bold text-white mb-2">
                Stay Updated
              </h3>
              <p className="text-blue-100">
                Get the latest updates on new features and AI improvements.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row w-full lg:w-auto space-y-3 sm:space-y-0 sm:space-x-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 flex-1 lg:w-64"
              />
              <button className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;




























{/* Library Section */ }
{/* <div className="mb-6">
              <button
                onClick={() => toggleSection('library')}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <Library className="h-4 w-4" />
                  <span>Library</span>
                </div>
                {expandedSections.library ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {expandedSections.library && (
                <div className="mt-2 space-y-1 pl-6">
                  {libraryItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => onClose?.()}
                        className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                          isActiveLink(item.href)
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </div>
                        {item.count && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                            {item.count}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div> */}










{/* <div className="mb-6">
              <button
                onClick={() => toggleSection('recent')}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Recent</span>
                </div>
                {expandedSections.recent ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {expandedSections.recent && (
                <div className="mt-2 space-y-2 pl-6">
                  {recentBooks.map((book) => (
                    <Link
                      key={book.id}
                      href={`/books/${book.id}`}
                      onClick={() => onClose?.()}
                      className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{book.title}</span>
                        <span className="text-xs text-gray-400 ml-2">
                          {book.progress}%
                        </span>
                      </div>
                      <div className="mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-blue-500 h-1 rounded-full transition-all"
                            style={{ width: `${book.progress}%` }}
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div> */}




{/* Bottom Settings */ }
{/* <div className="p-4 border-t border-gray-200">
            <Link
              href="/settings"
              onClick={() => onClose?.()}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActiveLink('/settings')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </div> */}