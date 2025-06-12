72% of storage used … If you run out of space, you can't save to Drive or back up Google Photos. Get 30 GB of storage for Rp 14.500,00 Rp 3.500,00/month for 3 months.
let userEmail = '';
const BASE_URL = 'https://script.google.com/macros/s/AKfycbx09J90mywgcMO4445sGwDNplzabc7HGZR2oXM6hpe8euf8-6duNW6gPO9QGReiUtX9/exec';


function handleCredentialResponse(response) {
  const decoded = JSON.parse(atob(response.credential.split('.')[1]));
  userEmail = decoded.email;

  fetch(`${BASE_URL}?action=user&email=${userEmail}`)
    .then(res => res.json())
    .then(data => {
      if (data.status === 'ok') {
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        document.getElementById('user-info').classList.remove('hidden');
        document.getElementById('user-name').innerText = `Halo, ${data.nama}`;
        document.getElementById('user-poin').innerText = data.poin;
        loadDashboard();
        loadReward();
      } else {
        alert('User tidak terdaftar');
      }
    });
}

function loadDashboard() {
  fetch(`${BASE_URL}?action=dashboard&email=${userEmail}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('total-transaksi').innerText = `Rp ${data.total.toLocaleString('id-ID')}`;

      const salesList = document.getElementById('top-sales');
      salesList.innerHTML = '';
      data.topSales.forEach(s => {
        const li = document.createElement('li');
        li.innerText = `${s.nama} (Rp ${s.total.toLocaleString('id-ID')})`;
        salesList.appendChild(li);
      });

      const ctx = document.getElementById('transaksiChart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
          datasets: [{
            label: 'Transaksi',
            data: data.grafik,
            backgroundColor: 'rgba(0, 99, 255, 0.2)',
            borderColor: '#002366',
            borderWidth: 2
          }]
        }
      });
    });
}

function loadReward() {
  fetch(`${BASE_URL}?action=reward`)
    .then(res => res.json())
    .then(rewards => {
      const container = document.getElementById('reward-gallery');
      container.innerHTML = '';
      rewards.forEach(r => {
        const div = document.createElement('div');
        div.className = 'border rounded-xl p-2 text-center';
        div.innerHTML = `
          <img src="${r.gambar}" class="mx-auto mb-2" />
          <h3 class="font-semibold">${r.nama}</h3>
          <p>${r.poin} poin</p>
          <button onclick="tukarReward('${r.id}')" class="mt-2 bg-blue-600 text-white px-3 py-1 rounded">Tukar</button>
        `;
        container.appendChild(div);
      });
    });
}

function tukarReward(id) {
  if (!confirm('Yakin ingin menukar reward ini?')) return;
  fetch(`${BASE_URL}?action=tukar&email=${userEmail}&id=${id}`, { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'ok') {
        alert('Penukaran berhasil!');
        document.getElementById('user-poin').innerText = data.poin;
        loadReward();
      } else {
        alert(data.message || 'Gagal menukar reward.');
      }
    });
}

function logout() {
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('user-info').classList.add('hidden');
  document.getElementById('login-section').classList.remove('hidden');
}
