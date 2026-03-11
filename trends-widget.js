async function loadTrends() {
  var container = document.getElementById('trends-widget');
  if (!container) return;
  fetch('/trends-data.json')
    .then(function(res) { return res.json(); })
    .then(function(json) {
      var timeline = json.interest_over_time.timeline_data;
      var keywords = ['tech regulation', 'corporate reputation', 'public affairs', 'AI policy', 'data privacy'];
      var colors = ['#b8843a', '#1a1d29', '#5a5d6b', '#888b99', '#c4b49a'];
      var labels = timeline.map(function(t) {
        var parts = t.date.replace(/[^a-zA-Z0-9 ,]/g, '').trim().split('  ')[0].trim();
        return parts.split(' ').slice(0,2).join(' ');
      });
      var datasets = keywords.map(function(kw, i) {
        return {
          label: kw.charAt(0).toUpperCase() + kw.slice(1),
          data: timeline.map(function(t) {
            var match = null;
            for (var j = 0; j < t.values.length; j++) {
              if (t.values[j].query.toLowerCase() === kw.toLowerCase()) {
                match = t.values[j];
                break;
              }
            }
            return match ? match.extracted_value : 0;
          }),
          borderColor: colors[i],
          backgroundColor: colors[i] + '15',
          borderWidth: i === 0 ? 2.5 : 1.8,
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
                color: '#5a5d6b',
                boxWidth: 16,
                padding: 20,
                usePointStyle: true,
                pointStyle: 'line'
              }
            },
            tooltip: {
              backgroundColor: '#ffffff',
              borderColor: 'rgba(26,29,41,0.08)',
              borderWidth: 1,
              titleColor: '#1a1d29',
              bodyColor: '#5a5d6b',
              padding: 12,
              callbacks: {
                label: function(ctx) {
                  return ' ' + ctx.dataset.label + ': ' + ctx.parsed.y;
                }
              }
            }
          },
          scales: {
            x: {
              ticks: { maxTicksLimit: 8, font: { size: 11 }, color: '#888b99' },
              grid: { display: false },
              border: { color: 'rgba(26,29,41,0.08)' }
            },
            y: {
              min: 0,
              max: 100,
              ticks: { font: { size: 11 }, color: '#888b99', stepSize: 25 },
              grid: { color: 'rgba(26,29,41,0.06)' },
              border: { display: false },
              title: { display: true, text: 'Search interest (0-100)', font: { size: 11 }, color: '#888b99' }
            }
          }
        }
      });
    })
    .catch(function(e) {
      container.innerHTML = '<p style="color:#5a5d6b;font-size:14px;">Trend data unavailable.</p>';
      console.error('Trends widget error:', e);
    });
}
document.addEventListener('DOMContentLoaded', loadTrends);
