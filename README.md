# VoltCart – Electronics E-commerce Website (College Project)

A front-end e-commerce demo store built with **HTML, CSS and vanilla JavaScript**. No server, database or paid tools needed.

## How to run
1. Unzip the folder.
2. Double-click `index.html` (any modern browser). That's it.

## Pages
| File | Purpose |
|---|---|
| index.html | Home: 3D rotating banner, product grid, search, category filters |
| cart.html | Cart with quantity update (+ / −), remove, total |
| wishlist.html | Saved items, move to cart |
| login.html | Sign up / Login |
| checkout.html | Delivery form + order summary (login required) |
| confirmation.html | Order confirmation |

## Folder structure
```
voltcart/
├── index.html, cart.html, wishlist.html, login.html, checkout.html, confirmation.html
├── css/style.css      (dark neon theme, responsive, 3D effects)
├── js/data.js         (product list)
└── js/app.js          (cart, wishlist, auth, search, checkout logic)
```

## Key concepts used
- **3D effects:** CSS `perspective`, `transform-style: preserve-3d` and `@keyframes` for the rotating banner; mouse-move tilt on product cards (JS); click "pop" animation.
- **State:** cart, wishlist, users and orders are stored in the browser's `localStorage`.
- **Responsive design:** CSS Grid, Flexbox and a media query for mobile screens.
- **Accessibility:** labels, focus outlines, reduced-motion support.

## Limitations (mention in viva)
- Login is a **demo** using localStorage; passwords are not encrypted. A real site needs a backend and hashing.
- Payments are simulated. Product icons are emojis (no external images required).

## Possible future work
Backend (Node.js/Express + MongoDB), real payment gateway, product detail pages, reviews, admin panel.
