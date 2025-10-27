import { createRoot } from 'react-dom';
import { useEffect } from 'react';
import "./index.css";

function MyFirstApp() {

    useEffect(() => {
        const contextData = window.ypoData;
        const nonce = contextData.nonce;

        console.log(nonce);
        fetch("/wordpress/wp-json/api/products/", {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': nonce, // Gửi nonce để xác thực user
            },
            credentials: 'same-origin'
        })
        .then(response => response.json)
        .then(data => {
            document.getElementById('result').textContent = JSON.stringify(data, null, 2);
          })
          .catch(error => {
            document.getElementById('result').textContent = 'Lỗi: ' + error.message;
        });

    }, []);

    return (
      <div>
        <h1 className="text-3xl font-bold underline text-red-500">
          Hello world!
        </h1>
        <span
          className="text-red-500 cursor-pointer"
        >
          Hello from JavaScript!
        </span>
        <pre id="result"></pre>
      </div>
    );
  }

window.addEventListener(
    'load',
    function () {
        const root = createRoot( document.getElementById( 'ypo-admin-page' ) );
        root.render(
            <MyFirstApp />,
        );
    },
    false
);
