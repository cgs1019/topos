goog.provide('topos.perf.Benchmark');


goog.scope(function() {

var perf = topos.perf;

perf.Benchmark = function(num_fr_samples, n, fn) {
  function update(previous_time, fr_samples) {
    var current_time = Date.now();
    var dt = current_time - previous_time;

    if (current_time % 1000 <= 100) {
      if (fr_samples.length >= num_fr_samples) {
        fr_samples.splice(0, 1);
      }
      if (dt > 0) {
        fr_samples.push(1 / (dt / 1000));
      }

      var frame_rate_sum = 0;
      for (var i in fr_samples) {
        frame_rate_sum += fr_samples[i]
      }

      var frame_rate = Math.round(frame_rate_sum / fr_samples.length);
    }

    for (var i = 0; i < n; i++) {
      fn();
    }
    window.requestAnimationFrame(
        function() {update(current_time, fr_samples);});
  }
  update(Date.now(), []);
}

});  // goog.scope
