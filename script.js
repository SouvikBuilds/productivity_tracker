document.addEventListener("DOMContentLoaded", function () {
    let currenttime = 0; // Initialize to 0
    let intervalTimer;
    let formattedTime;
    let ispaused = false
    let sessionsDone = 0

    function updateDisplay() {
        let hour = Math.floor(currenttime / 3600);
        let min = Math.floor((currenttime % 3600) / 60);
        let seconds = currenttime % 60;

        formattedTime =
            `${hour.toString().padStart(2, '0')}:` +
            `${min.toString().padStart(2, '0')}:` +
            `${seconds.toString().padStart(2, '0')}`;

        document.getElementById("timer").innerText = formattedTime;
    }

    let input_task = document.getElementById("input_task")

    function startTimer() {
        if (input_task.value.trim() !== '') {
            intervalTimer = setInterval(() => {
                currenttime++;
                updateDisplay();
            }, 1000);
        } else {
            alert("Enter a Valid Task First")
        }
    }

    function pauseTimer() {
        clearInterval(intervalTimer);
        if (!ispaused && currenttime > 0) {
            ispaused = true;
            sessionsDone++;

            const taskDetails = {
                Task: input_task.value.trim(),
                TimeTaken: formattedTime
            };

            localStorage.setItem("Session" + sessionsDone, JSON.stringify(taskDetails));
            appendTaskRow(sessionsDone, taskDetails);
        }
    }
    function resetTimer() {
        if (currenttime === 0) {
            alert("Timer is already at 00:00:00")
        } else {
            clearInterval(intervalTimer)
            currenttime = 0
            updateDisplay()
        }
    }
    function resumeTimer() {
        if (ispaused && currenttime > 0) {
            ispaused = false
            intervalTimer = setInterval(() => {
                currenttime++
                updateDisplay()
            }, 1000);
        }
    }
    function appendTaskRow(serialNo, taskDetails) {
        const tbody = document.getElementById("taskTableBody");
        const row = document.createElement("tr");

        const tdNo = document.createElement("td");
        tdNo.innerText = serialNo;

        const tdTask = document.createElement("td");
        tdTask.innerText = taskDetails.Task;

        const tdTime = document.createElement("td");
        tdTime.innerText = taskDetails.TimeTaken;

        row.appendChild(tdNo);
        row.appendChild(tdTask);
        row.appendChild(tdTime);

        tbody.appendChild(row);
    }

    function initializeTable() {
        const keys = Object.keys(localStorage)
            .filter(k => k.startsWith("Session"))
            .sort((a, b) => {
                const nA = parseInt(a.replace("Session", ""));
                const nB = parseInt(b.replace("Session", ""));
                return nA - nB;
            });

        keys.forEach(key => {
            const serialNo = parseInt(key.replace("Session", ""));
            const taskDetails = JSON.parse(localStorage.getItem(key));
            appendTaskRow(serialNo, taskDetails);
        });

        sessionsDone = keys.length;
    }


    initializeTable();

    document.getElementById("Start").addEventListener("click", startTimer)
    document.getElementById("Pause").addEventListener("click", pauseTimer)
    document.getElementById("Resume").addEventListener("click", resumeTimer)
    document.getElementById("Reset").addEventListener("click", resetTimer)
});
