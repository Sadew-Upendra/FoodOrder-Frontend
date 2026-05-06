import { Link } from 'react-router-dom'
import { Utensils, Globe, MessageCircle, Share2, Mail, Phone, MapPin } from 'lucide-react'

const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/orders', label: 'My Orders' },
  { to: '/cart', label: 'My Cart' },
]

const SUPPORT_LINKS = ['FAQ', 'Contact Us', 'Terms of Service', 'Privacy Policy']

export const Footer = () => (
  <footer className="bg-[#2f3542] text-white pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 bg-[#ff4757] rounded-xl flex items-center justify-center">
              <Utensils size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold">Foodie<span className="text-[#ff4757]">Express</span></span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            Connecting you to the best flavors in town. Fast, fresh, and always delicious.
          </p>
          <div className="flex gap-3">
            {[Globe, MessageCircle, Share2].map((Icon, i) => (
              <a key={i} href="#"
                className="w-9 h-9 bg-white/10 hover:bg-[#ff4757] rounded-full flex items-center justify-center transition-colors">
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-semibold mb-5 text-sm uppercase tracking-wider text-gray-300">Quick Links</h4>
          <ul className="space-y-3">
            {QUICK_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-gray-400 hover:text-white text-sm transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-semibold mb-5 text-sm uppercase tracking-wider text-gray-300">Support</h4>
          <ul className="space-y-3">
            {SUPPORT_LINKS.map(label => (
              <li key={label}>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">{label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-5 text-sm uppercase tracking-wider text-gray-300">Contact</h4>
          <div className="space-y-3">
            <p className="flex items-start gap-2.5 text-sm text-gray-400">
              <MapPin size={15} className="mt-0.5 shrink-0" /> FoodieExpress, Panadura, Sri Lanka
            </p>
            <p className="flex items-center gap-2.5 text-sm text-gray-400">
              <Phone size={15} /> +94 77 000 0000
            </p>
            <p className="flex items-center gap-2.5 text-sm text-gray-400">
              <Mail size={15} /> hello@foodieexpress.lk
            </p>
          </div>
        </div>

      </div>
      <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
        <span>© 2026 FoodieExpress — All Rights Reserved</span>
        <span>Developed by Sadew Upendra</span>
      </div>
    </div>
  </footer>
)
