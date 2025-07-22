const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
const submenus = document.querySelectorAll(".submenu");

hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

submenus.forEach((menu) => {
    menu.addEventListener("click", () => {
        menu.classList.toggle("active");
    });
});



document.querySelectorAll(".percentage-circle").forEach((circle, index) => {
    const percentageValues = [80, 90, 70]; // Adjust the values dynamically if required
    circle.innerText = percentageValues[index] + "%";
});

// Show/Hide Add Bike Section
const showAddBikeBtn = document.getElementById("showAddBikeBtn");
const addBikeSection = document.getElementById("addBikeSection");

showAddBikeBtn.addEventListener("click", function () {
    if (addBikeSection.style.display === "none") {
        addBikeSection.style.display = "block";
    } else {
        addBikeSection.style.display = "none";
    }
});


let editingRow = null; // Track the row being edited

function showTab(tabName) {
    const tabs = document.querySelectorAll(".tab-content");
    const buttons = document.querySelectorAll(".tab-button");

    tabs.forEach((tab) => {
        tab.classList.remove("active");
    });

    buttons.forEach((button) => {
        button.classList.remove("active");
    });

    document.getElementById(tabName).classList.add("active");
    event.target.classList.add("active");
}


function setQuickDateRange(days) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    document.getElementById("startDate").value = startDate
        .toISOString()
        .split("T")[0];
    document.getElementById("endDate").value = endDate
        .toISOString()
        .split("T")[0];
}


window.onload = function () {
    // Bike Chart
    const bikeCtx = document.getElementById("bikeChart").getContext("2d");
    const bikeChart = new Chart(bikeCtx, {
        type: "bar",
        data: {
            labels: ["TVS Jupiter", "TVS Apache RTR 160 BS6", "Royal Enfield Bullet", "Bajaj Pulsar 200 NS", "Bajaj Avenger 220", "Bajaj Pulsar 220", "Honda Activa 5G", "Suzuki Access 125", "Royal Enfield Himalayan", "TVS Jupiter Classic", "Suzuki Intruder", "Honda CBR 250R"],
            datasets: [{
                label: "Times Rented",
                data: [10, 15, 8, 12, 5, 20, 13, 8, 3, 9, 11, 5],
                backgroundColor: ["#007bff", "#ff5733", "#28a745", "#ffc107", "#6610f2", "#17a2b8", "#dc3545", "#28a745", "#6c757d", "#c64e98", "#10eaf2", "#6610f2"],
            }],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Bike Rentals" },
            },
        },
    });

    // Car Chart
    const carCtx = document.getElementById("carChart").getContext("2d");
    const carChart = new Chart(carCtx, {
        type: "bar",
        data: {
            labels: ["Maruti Ertiga", "Tata Safari", "Toyota Innova", "Hyundai i20", "KIA Sonet", "Maruti Dzire", "Toyota Glanza", "Toyota Innova Crysta", "Hyundai i10 Grand", "Maruti Baleno", "Ford Ecosport", "Mahindra Scorpio"],
            datasets: [{
                label: "Times Rented",
                data: [2, 5, 3, 10, 5, 18, 12, 15, 20, 11, 9, 4],
                backgroundColor: ["#dc8635", "#6c757d", "#28a745", "#6610f2", "#6c757d", "#17a2b8", "#dc3545", "#c64e98", "#10eaf2", "#007bff", "#ffc107", "#ff5733"],
            }],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Car Rentals" },
            },
        },
    });
};




// Show scroll-to-top button when scrolling down
window.onscroll = function () {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
};

// Scroll to top function when the button is clicked
document.getElementById('scrollToTop').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

