import React, { useState, useRef, useEffect } from 'react';
import { assets, products } from '../assets/assets';

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your shopping assistant. I can help you find the perfect clothing! Try asking me things like 'Show me men topwear under ₹200' or 'I want women winterwear in medium size' or 'Find kids bottomwear'.",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, searchResults]);

  // Function to parse natural language query
  const parseQuery = (query) => {
    const lowerQuery = query.toLowerCase();
    const filters = {
      color: null,
      size: null,
      category: null,
      subCategory: null,
      priceRange: null,
      keywords: []
    };

    // Extract colors
    const colors = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'pink', 'purple', 'orange', 'brown', 'gray', 'grey', 'navy', 'maroon', 'beige', 'cream'];
    colors.forEach(color => {
      if (lowerQuery.includes(color)) {
        filters.color = color;
      }
    });

    // Extract sizes
    const sizes = ['xs', 'small', 's', 'medium', 'm', 'large', 'l', 'xl', 'xxl', 'xxxl'];
    sizes.forEach(size => {
      if (lowerQuery.includes(size)) {
        filters.size = size;
      }
    });

    // Extract main categories (Men, Women, Kids)
    if (lowerQuery.includes('men') || lowerQuery.includes('man') || lowerQuery.includes('male')) {
      filters.category = 'Men';
    } else if (lowerQuery.includes('women') || lowerQuery.includes('woman') || lowerQuery.includes('female') || lowerQuery.includes('ladies')) {
      filters.category = 'Women';
    } else if (lowerQuery.includes('kids') || lowerQuery.includes('kid') || lowerQuery.includes('children') || lowerQuery.includes('child') || lowerQuery.includes('boys') || lowerQuery.includes('girls')) {
      filters.category = 'Kids';
    }

    // Extract subcategories
    if (lowerQuery.includes('topwear') || lowerQuery.includes('top wear') || lowerQuery.includes('t-shirt') || lowerQuery.includes('tshirt') || lowerQuery.includes('shirt') || lowerQuery.includes('top')) {
      filters.subCategory = 'Topwear';
    } else if (lowerQuery.includes('bottomwear') || lowerQuery.includes('bottom wear') || lowerQuery.includes('pants') || lowerQuery.includes('trousers') || lowerQuery.includes('jeans') || lowerQuery.includes('bottom')) {
      filters.subCategory = 'Bottomwear';
    } else if (lowerQuery.includes('winterwear') || lowerQuery.includes('winter wear') || lowerQuery.includes('jacket') || lowerQuery.includes('winter') || lowerQuery.includes('coat')) {
      filters.subCategory = 'Winterwear';
    }

    // Extract price range
    const priceMatch = lowerQuery.match(/under\s*₹?(\d+)|below\s*₹?(\d+)|less\s*than\s*₹?(\d+)|upto\s*₹?(\d+)|maximum\s*₹?(\d+)|below\s*(\d+)|under\s*(\d+)/);
    if (priceMatch) {
      filters.priceRange = parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3] || priceMatch[4] || priceMatch[5] || priceMatch[6] || priceMatch[7]);
    }

    // Extract other keywords
    const keywords = ['clothing', 'apparel', 'fashion', 'outfit', 'garment'];
    keywords.forEach(keyword => {
      if (lowerQuery.includes(keyword)) {
        filters.keywords.push(keyword);
      }
    });

    return filters;
  };

  // Function to search products based on filters
  const searchProducts = async (filters) => {
    try {
      setIsLoading(true);
      let filteredProducts = [...products]; // Use local products data

      // Apply filters
      if (filters.color) {
        filteredProducts = filteredProducts.filter(product => 
          product.name.toLowerCase().includes(filters.color) ||
          product.description.toLowerCase().includes(filters.color)
        );
      }

      if (filters.category) {
        filteredProducts = filteredProducts.filter(product => 
          product.category === filters.category
        );
      }

      if (filters.subCategory) {
        filteredProducts = filteredProducts.filter(product => 
          product.subCategory === filters.subCategory
        );
      }

      if (filters.size) {
        filteredProducts = filteredProducts.filter(product => 
          product.sizes.some(size => size.toLowerCase().includes(filters.size))
        );
      }

      if (filters.priceRange) {
        filteredProducts = filteredProducts.filter(product => product.price <= filters.priceRange);
      }

      // If no specific filters, search by keywords in name/description
      if (!filters.color && !filters.category && !filters.subCategory && !filters.size && !filters.priceRange && filters.keywords.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
          filters.keywords.some(keyword => 
            product.name.toLowerCase().includes(keyword) ||
            product.description.toLowerCase().includes(keyword)
          )
        );
      }

      // If no filters applied, return all products (limited)
      if (!filters.color && !filters.category && !filters.subCategory && !filters.size && !filters.priceRange && filters.keywords.length === 0) {
        filteredProducts = products.slice(0, 8);
      }

      return filteredProducts.slice(0, 8); // Limit to 8 results
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Function to generate bot response
  const generateBotResponse = (filters, results) => {
    if (results.length === 0) {
      return "I couldn't find any products matching your criteria. Try adjusting your search terms or browse our collection for more options!";
    }

    let response = `I found ${results.length} product${results.length > 1 ? 's' : ''} for you! `;
    
    if (filters.color) response += `All in ${filters.color} color. `;
    if (filters.category) response += `From our ${filters.category} collection. `;
    if (filters.subCategory) response += `Perfect ${filters.subCategory} options. `;
    if (filters.size) response += `Available in ${filters.size} size. `;
    if (filters.priceRange) response += `Under ₹${filters.priceRange}. `;
    
    response += "Here are the results:";
    
    return response;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Parse the query and search for products
    const filters = parseQuery(inputText);
    const results = await searchProducts(filters);
    
    const botResponse = {
      id: Date.now() + 1,
      text: generateBotResponse(filters, results),
      isBot: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botResponse]);
    setSearchResults(results);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Shopping Assistant</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isBot
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-blue-500 text-white'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                <p className="text-sm">Searching for dresses...</p>
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Search Results</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {searchResults.map((product) => (
                  <div key={product._id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-3">
                      <h4 className="font-medium text-gray-800 text-sm mb-1 line-clamp-2">
                        {product.name}
                      </h4>
                      <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-green-600 font-semibold">₹{product.price}</span>
                        <span className="text-xs text-gray-500">
                          {product.sizes.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about clothing... (e.g., 'Show me men topwear under ₹200')"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
