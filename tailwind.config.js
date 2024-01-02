/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      backgroundImage: {
        // 'hero-pattern': "url('https://th.bing.com/th/id/R.afa41353b41e7cdd407f97f9377ea758?rik=2STe1zIp7Jj48g&pid=ImgRaw&r=0')",
        'hero-pattern': "url('https://i0.wp.com/magenest.com/wp-content/uploads/2021/05/inventory-management-objectives.png')",
        'footer-texture': "url('C:\Users\Lenovo\Downloads\Cornelia_and_Euphiemia_-_Aeries_Villa.png')",
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar'),
  ],
}

