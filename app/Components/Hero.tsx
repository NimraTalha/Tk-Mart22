'use client';

const Hero = () => {
    return (
        <div className="relative bg-yellow-50">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFD700' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '20px 20px'
                }}/>
            </div>

            <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    {/* Text Content */}
                    <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                            <span className="block">TK-Mart Shopping</span>
                            <span className="block text-yellow-600">Furniture Market</span>
                        </h1>
                        <p className="mt-3 max-w-md mx-auto md:mx-0 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl">
                        Explore our premium collection of furniture that combines elegance with comfort. Find the perfect piece for your home with unbeatable prices and fast delivery.
                        </p>
                        <div className="mt-8 flex justify-center md:justify-start space-x-4">
                            <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-400">
                                Shop Now
                            </button>
                            <button className="inline-flex items-center px-6 py-3 border border-yellow-600 text-base font-medium rounded-md text-yellow-600 bg-transparent hover:bg-yellow-50">
                                Our Menu
                            </button>
                        </div>
                    </div>

                    {/* Image/Decorative Element */}
                    <div className="md:w-1/2 relative h-64 md:h-96">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-yellow-100 rounded-2xl transform rotate-3">
                            <div className="absolute inset-0 transform -rotate-6 bg-yellow-100 rounded-2xl shadow-lg">
                                {/* Placeholder for actual product image */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-yellow-600 text-lg font-medium">Your Featured Product Image</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;