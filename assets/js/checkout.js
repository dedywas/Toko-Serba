// Modul Checkout & Integrasi WhatsApp & Faktur Pembayaran

// Buka Modal Checkout
function openCheckoutModal() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast("Keranjang Anda masih kosong!", "warning");
    return;
  }

  // Tutup cart drawer
  closeCartDrawer();

  // Populate Ringkasan Pesanan di Modal
  const checkoutItemsList = document.getElementById("checkout-items-list");
  const { subtotal, discount, shippingFee, total, coupon } = calculateCartTotals();

  if (checkoutItemsList) {
    checkoutItemsList.innerHTML = cart
      .map(
        (item) => `
      <div class="flex items-center justify-between text-sm py-2 border-b border-slate-100">
        <div class="flex items-center space-x-3">
          <img src="${item.image}" alt="${item.name}" class="w-10 h-10 object-cover rounded-md border border-slate-200" />
          <div>
            <p class="font-medium text-slate-800 line-clamp-1">${item.name}</p>
            <p class="text-xs text-slate-500">${item.quantity} x ${formatRupiah(item.price)}</p>
          </div>
        </div>
        <span class="font-semibold text-slate-700">${formatRupiah(item.price * item.quantity)}</span>
      </div>
    `
      )
      .join("");
  }

  // Update Biaya di Modal Checkout
  document.getElementById("checkout-subtotal").textContent = formatRupiah(subtotal);
  document.getElementById("checkout-shipping").textContent = formatRupiah(shippingFee);
  
  const discountRow = document.getElementById("checkout-discount-row");
  if (discount > 0) {
    discountRow.classList.remove("hidden");
    document.getElementById("checkout-discount").textContent = `-${formatRupiah(discount)}`;
  } else {
    discountRow.classList.add("hidden");
  }

  document.getElementById("checkout-total").textContent = formatRupiah(total);

  // Tampilkan Modal
  const modal = document.getElementById("checkout-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeCheckoutModal() {
  const modal = document.getElementById("checkout-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// Proses Pemesanan (WhatsApp atau Transfer/Invoice)
function handleCheckoutSubmit(e) {
  e.preventDefault();

  const customerName = document.getElementById("cust-name").value.trim();
  const customerPhone = document.getElementById("cust-phone").value.trim();
  const customerAddress = document.getElementById("cust-address").value.trim();
  const shippingMethod = document.getElementById("cust-shipping").value;
  const paymentMethod = document.querySelector('input[name="payment_method"]:checked')?.value || "WhatsApp";
  const notes = document.getElementById("cust-notes").value.trim();

  if (!customerName || !customerPhone || !customerAddress) {
    showToast("Silakan lengkapi formulir pengiriman!", "warning");
    return;
  }

  const cart = getCart();
  const totals = calculateCartTotals();
  const config = getStoreConfig();

  // Buat objek order baru
  const orderId = "INV-" + new Date().getFullYear() + ("0" + (new Date().getMonth() + 1)).slice(-2) + "-" + Math.floor(1000 + Math.random() * 9000);
  const newOrder = {
    id: orderId,
    date: new Date().toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }),
    customer: {
      name: customerName,
      phone: customerPhone,
      address: customerAddress
    },
    items: cart,
    totals: totals,
    shippingMethod: shippingMethod,
    paymentMethod: paymentMethod,
    notes: notes,
    status: "Menunggu Pembayaran"
  };

  // Simpan ke riwayat pesanan (Local Storage)
  saveOrder(newOrder);

  // Tutup modal checkout
  closeCheckoutModal();

  if (paymentMethod === "WhatsApp") {
    // Buat format pesan WhatsApp yang rapi & terstruktur
    sendOrderViaWhatsApp(newOrder, config);
  } else {
    // Tampilkan Invoice / Struk digital
    showInvoiceModal(newOrder);
  }

  // Kosongkan keranjang belanja
  clearCart();
}

// Format Pesan WhatsApp
function sendOrderViaWhatsApp(order, config) {
  let itemListText = "";
  order.items.forEach((item, index) => {
    itemListText += `${index + 1}. *${item.name}*\n   ${item.quantity} pcs x ${formatRupiah(item.price)} = ${formatRupiah(item.price * item.quantity)}\n`;
  });

  const message = 
`Halo Admin *${config.storeName}*, saya ingin melakukan pemesanan! 👋

📄 *NO. PESANAN: ${order.id}*
Tanggal: ${order.date}

🛒 *DAFTAR BELANJA:*
${itemListText}
💰 *RINCIAN BIAYA:*
- Subtotal: ${formatRupiah(order.totals.subtotal)}
${order.totals.discount > 0 ? `- Diskon (${order.totals.coupon.code}): -${formatRupiah(order.totals.discount)}\n` : ""}- Ongkos Kirim (${order.shippingMethod}): ${formatRupiah(order.totals.shippingFee)}
*TOTAL BAYAR: ${formatRupiah(order.totals.total)}*

📍 *DATA PENERIMA:*
- Nama: *${order.customer.name}*
- No. WhatsApp: ${order.customer.phone}
- Alamat Lengkap: ${order.customer.address}
- Ekspedisi: ${order.shippingMethod}
- Metode Bayar: ${order.paymentMethod}
${order.notes ? `- Catatan Khusus: ${order.notes}` : ""}

Mohon konfirmasi ketersediaan dan nomor rekening untuk proses transfer. Terima kasih banyak! 🙏`;

  const waUrl = `https://wa.me/${config.phone}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, "_blank");
  showToast("Pesanan dibuat! Membuka WhatsApp...", "success");
}

// Tampilkan Modal Invoice Digital
function showInvoiceModal(order) {
  const config = getStoreConfig();
  const invoiceModal = document.getElementById("invoice-modal");
  const invoiceContent = document.getElementById("invoice-printable");

  invoiceContent.innerHTML = `
    <div class="p-6 md:p-8 bg-white rounded-2xl max-w-2xl mx-auto border border-slate-200">
      <!-- Invoice Header -->
      <div class="flex justify-between items-start pb-6 border-b border-slate-200">
        <div>
          <div class="flex items-center space-x-2">
            <div class="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              ${config.storeName.charAt(0)}
            </div>
            <span class="text-xl font-bold text-slate-800">${config.storeName}</span>
          </div>
          <p class="text-xs text-slate-500 mt-1">${config.tagline}</p>
          <p class="text-xs text-slate-500">${config.address}</p>
        </div>
        <div class="text-right">
          <span class="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
            ${order.status}
          </span>
          <p class="text-base font-bold text-slate-800 mt-2">${order.id}</p>
          <p class="text-xs text-slate-500">${order.date}</p>
        </div>
      </div>

      <!-- Customer & Shipping Details -->
      <div class="grid grid-cols-2 gap-4 py-4 text-xs border-b border-slate-200">
        <div>
          <span class="text-slate-400 block font-medium">DITUJUKAN KEPADA:</span>
          <p class="font-bold text-slate-800 mt-1">${order.customer.name}</p>
          <p class="text-slate-600">${order.customer.phone}</p>
          <p class="text-slate-600 mt-1">${order.customer.address}</p>
        </div>
        <div>
          <span class="text-slate-400 block font-medium">METODE PEMBAYARAN:</span>
          <p class="font-bold text-sky-700 mt-1">${order.paymentMethod}</p>
          <span class="text-slate-400 block font-medium mt-2">KURIR PENGIRIMAN:</span>
          <p class="font-semibold text-slate-700">${order.shippingMethod}</p>
        </div>
      </div>

      <!-- Product List Table -->
      <table class="w-full text-left my-4 text-xs">
        <thead>
          <tr class="text-slate-400 border-b border-slate-200">
            <th class="pb-2">Produk</th>
            <th class="pb-2 text-center">Qty</th>
            <th class="pb-2 text-right">Harga</th>
            <th class="pb-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          ${order.items
            .map(
              (item) => `
            <tr>
              <td class="py-2.5 font-medium text-slate-800">${item.name}</td>
              <td class="py-2.5 text-center text-slate-600">${item.quantity}</td>
              <td class="py-2.5 text-right text-slate-600">${formatRupiah(item.price)}</td>
              <td class="py-2.5 text-right font-semibold text-slate-800">${formatRupiah(item.price * item.quantity)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <!-- Summary -->
      <div class="border-t border-slate-200 pt-3 space-y-1.5 text-xs text-right">
        <div class="flex justify-between text-slate-600">
          <span>Subtotal Produk:</span>
          <span class="font-medium">${formatRupiah(order.totals.subtotal)}</span>
        </div>
        ${
          order.totals.discount > 0
            ? `
          <div class="flex justify-between text-emerald-600 font-medium">
            <span>Diskon (${order.totals.coupon.code}):</span>
            <span>-${formatRupiah(order.totals.discount)}</span>
          </div>
        `
            : ""
        }
        <div class="flex justify-between text-slate-600">
          <span>Ongkos Kirim:</span>
          <span class="font-medium">${formatRupiah(order.totals.shippingFee)}</span>
        </div>
        <div class="flex justify-between text-base font-bold text-slate-800 pt-2 border-t border-slate-200">
          <span>Total Pembayaran:</span>
          <span class="text-sky-600">${formatRupiah(order.totals.total)}</span>
        </div>
      </div>

      <!-- Petunjuk Pembayaran -->
      <div class="mt-6 p-4 bg-sky-50 rounded-xl border border-sky-100 text-xs">
        <p class="font-semibold text-sky-900 mb-1">Instruksi Pembayaran Transfer Bank:</p>
        <p class="text-sky-800">Bank: <strong class="uppercase">${config.bankName}</strong></p>
        <p class="text-sky-800">No. Rekening: <strong class="font-mono text-sm">${config.bankAccount}</strong></p>
        <p class="text-sky-800">Atas Nama: <strong>${config.bankHolder}</strong></p>
        <p class="text-slate-500 mt-2 text-[11px] leading-relaxed">Setelah melakukan transfer, silakan konfirmasi bukti pembayaran ke WhatsApp kami di <strong>+${config.phone}</strong> dengan menyertakan Nomor Pesanan <strong>${order.id}</strong>.</p>
      </div>
    </div>
  `;

  invoiceModal.classList.remove("hidden");
  invoiceModal.classList.add("flex");
}

function closeInvoiceModal() {
  const modal = document.getElementById("invoice-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}
