import { Package } from 'lucide-react';
import { Link } from 'react-router-dom';

function Logo() {
    return (
        <div className="flex items-center space-x-2">
            <Package className="w-8 h-8 text-blue-600" />
            <a href="/home" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition">courierKaro</a>
        </div>
    )
}

export default Logo
