async function loadTrends() {
  var container = document.getElementById('trends-widget');
  if (!container) return;
  fetch('/trends-data.json')
    .then(function(res) { return res.json(); })
    .then(function(json) {
      var timeline = json.interest_over_time.timeline_data;
      var keywords = ["data centers", "AI regulation", "antitrust", "energy costs", "deepfakes"];
      var colors = ["#2563eb", "#dc2626", "#16a34a", "#d97706", "#7c3aed"];
      var labels = timeline.map(function(t) {
        return t.date.split('–')[0].trim();
      });
      var datasets = keywords.map(function(kw, i) {
        return {
          label: kw.charAt(0).toUpperCase() + kw.slice(1),
          data: timeline.map(function(t) {
            for (var j = 0; j < t.values.length; j++) {
              if (t.values[j].query.toLowerCase() === kw.toLowerCase()) {
                return t.values[j].extracted_value;
              }
            }
            return 0;
          }),
          borderColor: colors[i],
          backgroundColor: colors[i] + '18',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.4,
          fill: false
        };
      });
      var canvas = document.createElement('canvas');
      canvas.style.maxHeight = '320px';
      container.appendChild(canvas);
      new Chart(canvas, {
        type: 'line',
        data: { labels: labels, datasets: datasets },
        options: {
          responsive: true,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: { family: 'system-ui, sans-serif', size: 12 },
                color: '#374151',
                boxWidth: 24,
                padding: 20,
                usePointStyle: true,
                pointStyle: 'line'
              }
            },
            tooltip: {
              backgroundColor: '#ffffff',
              borderColor: 'rgba(0,0,0,0.1)',
              borderWidth: 1,
              titleColor: '#111827',
              bodyColor: '#4b5563',
              padding: 12,
              callbacks: {
                label: function(ctx) {
                  return '  ' + ctx.dataset.label + ': ' + ctx.parsed.y;
                }
              }
            }
          },
          scales: {
            x: {
              ticks: { maxTicksLimit: 8, font: { size: 11 }, color: '#9ca3af' },
              grid: { display: false },
              border: { color: 'rgba(0,0,0,0.08)' }
            },
            y: {
              min: 0,
              max: 100,
              ticks: { font: { size: 11 }, color: '#9ca3af', stepSize: 25 },
              grid: { color: 'rgba(0,0,0,0.05)' },
              border: { display: false },
              title: { display: true, text: 'Search interest (0–100)', font: { size: 11 }, color: '#9ca3af' }
            }
          }
        }
      });
    })
    .catch(function(e) {
      container.innerHTML = '<p style="color:#6b7280;font-size:14px;">Trend data unavailable.</p>';
      console.error('Trends widget error:', e);
    });
}
document.addEventListener('DOMContentLoaded', loadTrends);
