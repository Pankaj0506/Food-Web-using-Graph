onload = function () {
  let curr_data, V, src, dst;

  const container = document.getElementById("mynetwork");
  const container2 = document.getElementById("mynetwork2");
  const genNew = document.getElementById("generate-graph");
  const solve = document.getElementById("solve");
  const temptext = document.getElementById("temptext");
  const temptext2 = document.getElementById("temptext2");
  const animals = [
    "Lion",
    "Wild Cat",
    "Jackal",
    "Goat",
    "Mouse",
    "Rabbit",
    "Green Plant",
  ];

  // initialise graph options
  const options = {
    edges: {
      labelHighlightBold: true,
      font: {
        size: 20,
      },
    },
    nodes: {
      font: "12px arial red",
      scaling: {
        label: true,
      },
      shape: "icon",
      icon: {
        face: "FontAwesome",
        code: "🦁",
        size: 40,
      },
    },
  };

  // Initialize your network!
  // Network for question graph
  const network = new vis.Network(container);
  network.setOptions(options);
  // Network for result graph
  const network2 = new vis.Network(container2);
  network2.setOptions(options);

  function createData() {
    V = 7; // Ensures V is between 3 and 10
    let nodes = [];
    nodes.push({ id: 1, label: animals[0], shape: "icon",
      icon: {
        face: "FontAwesome",
        code: "🦁",
        size: 40,
      }, });
    nodes.push({ id: 2, label: animals[1], shape: "icon",
      icon: {
        face: "FontAwesome",
        code: "🐱",
        size: 40,
      }, });
    nodes.push({ id: 3, label: animals[2], shape: "icon",
      icon: {
        face: "FontAwesome",
        code: "🦊",
        size: 40,
      }, });
    nodes.push({ id: 4, label: animals[3], shape: "icon",
      icon: {
        face: "FontAwesome",
        code: "🐐",
        size: 40,
      }, });
    nodes.push({ id: 5, label: animals[4], shape: "icon",
      icon: {
        face: "FontAwesome",
        code: "🐭",
        size: 40,
      }, });
    nodes.push({ id: 6, label: animals[5], shape: "icon",
      icon: {
        face: "FontAwesome",
        code: "🐰",
        size: 40,
      }, });
    nodes.push({ id: 7, label: animals[6], shape: "icon",
      icon: {
        face: "FontAwesome",
        code: "🌳",
        size: 40,
      }, });
    // Prepares vis.js style nodes for our data
    nodes = new vis.DataSet(nodes);

    // Creating a tree like underlying graph structure
    let edges = [];
    //Lion
    edges.push({
      type: 0,
      from: 1,
      to: 2,
      color: "orange",
      label: String(1),
    });
    edges.push({
      type: 0,
      from: 1,
      to: 3,
      color: "orange",
      label: String(1),
    });
    edges.push({
      type: 0,
      from: 1,
      to: 4,
      color: "orange",
      label: String(1),
    });
    //WildCat
    edges.push({
      type: 0,
      from: 2,
      to: 5,
      color: "green",
      label: String(1),
    });
    edges.push({
      type: 0,
      from: 2,
      to: 6,
      color: "green",
      label: String(1),
    });
    //Jackal
    edges.push({
      type: 0,
      from: 3,
      to: 4,
      color: "blue",
      label: String(1),
    });
    edges.push({
      type: 0,
      from: 3,
      to: 5,
      color: "blue",
      label: String(1),
    });
    edges.push({
      type: 0,
      from: 3,
      to: 6,
      color: "blue",
      label: String(1),
    });
    //Mouse
    edges.push({
      type: 0,
      from: 5,
      to: 7,
      color: "black",
      label: String(1),
    });
    //Rabbit
    edges.push({
      type: 0,
      from: 6,
      to: 7,
      color: "darkgray",
      label: String(1),
    });
    //Goat
    edges.push({
      type: 0,
      from: 4,
      to: 7,
      color: "red",
      label: String(1),
    });

    // Setting the new values of global variables
    src = 1 + Math.floor(Math.random()*6);
    dst = V;
    curr_data = {
      nodes: nodes,
      edges: edges,
    };
  }

  genNew.onclick = function () {
    // Create new data and display the data
    createData();
    network.setData(curr_data);
    temptext2.innerText =
      "Find Food Chain from " + animals[src - 1] + " to " + animals[dst - 1];
    temptext.style.display = "inline";
    temptext2.style.display = "inline";
    container2.style.display = "none";
  };

  solve.onclick = function () {
    // Create graph from data and set to display
    temptext.style.display = "none";
    temptext2.style.display = "none";
    container2.style.display = "inline";
    network2.setData(solveData());
  };

  function djikstra(graph, sz, src) {
    let vis = Array(sz).fill(0);
    let dist = [];
    for (let i = 1; i <= sz; i++) dist.push([10000, -1]);
    dist[src][0] = 0;

    for (let i = 0; i < sz - 1; i++) {
      let mn = -1;
      for (let j = 0; j < sz; j++) {
        if (vis[j] === 0) {
          if (mn === -1 || dist[j][0] < dist[mn][0]) mn = j;
        }
      }

      vis[mn] = 1;
      for (let j in graph[mn]) {
        let edge = graph[mn][j];
        if (vis[edge[0]] === 0 && dist[edge[0]][0] > dist[mn][0] + edge[1]) {
          dist[edge[0]][0] = dist[mn][0] + edge[1];
          dist[edge[0]][1] = mn;
        }
      }
    }

    return dist;
  }

  function createGraph(data) {
    let graph = [];
    for (let i = 1; i <= V; i++) {
      graph.push([]);
    }

    for (let i = 0; i < data["edges"].length; i++) {
      let edge = data["edges"][i];
      if (edge["type"] === 1) continue;
      graph[edge["to"] - 1].push([edge["from"] - 1, parseInt(edge["label"])]);
      graph[edge["from"] - 1].push([edge["to"] - 1, parseInt(edge["label"])]);
    }
    return graph;
  }

  function shouldTakePlane(edges, dist1, dist2, mn_dist) {
    let plane = 0;
    let p1 = -1,
      p2 = -1;
    for (let pos in edges) {
      let edge = edges[pos];
      if (edge["type"] === 1) {
        let to = edge["to"] - 1;
        let from = edge["from"] - 1;
        let wght = parseInt(edge["label"]);
        if (dist1[to][0] + wght + dist2[from][0] < mn_dist) {
          plane = wght;
          p1 = to;
          p2 = from;
          mn_dist = dist1[to][0] + wght + dist2[from][0];
        }
        if (dist2[to][0] + wght + dist1[from][0] < mn_dist) {
          plane = wght;
          p2 = to;
          p1 = from;
          mn_dist = dist2[to][0] + wght + dist1[from][0];
        }
      }
    }
    return { plane, p1, p2 };
  }

  function solveData() {
    const data = curr_data;

    // Creating adjacency list matrix graph from question data
    const graph = createGraph(data);

    // Applying djikstra from src and dst
    let dist1 = djikstra(graph, V, src - 1);
    let dist2 = djikstra(graph, V, dst - 1);

    // Initialise min_dist to min distance via bus from src to dst
    let mn_dist = dist1[dst - 1][0];

    // See if plane should be used
    let { plane, p1, p2 } = shouldTakePlane(
      data["edges"],
      dist1,
      dist2,
      mn_dist
    );

    let new_edges = [];
    if (plane !== 0) {
      new_edges.push({
        arrows: { to: { enabled: true } },
        from: p2 + 1,
        to: p1 + 1,
        color: "blue",
        label: String(plane),
      });
      // Using spread operator to push elements of result of pushEdges to new_edges
      new_edges.push(...pushEdges(dist1, p1, false));
      new_edges.push(...pushEdges(dist2, p2, true));
    } else {
      new_edges.push(...pushEdges(dist1, dst - 1, false));
    }
    const ans_data = {
      nodes: data["nodes"],
      edges: new_edges,
    };
    return ans_data;
  }

  function pushEdges(dist, curr, reverse) {
    let tmp_edges = [];
    while (dist[curr][0] !== 0) {
      let fm = dist[curr][1];
      if (reverse)
        tmp_edges.push({
          arrows: { to: { enabled: true } },
          from: curr + 1,
          to: fm + 1,
          color: "green",
          label: String(dist[curr][0] - dist[fm][0]),
        });
      else
        tmp_edges.push({
          arrows: { to: { enabled: true } },
          from: fm + 1,
          to: curr + 1,
          color: "green",
          label: String(dist[curr][0] - dist[fm][0]),
        });
      curr = fm;
    }
    return tmp_edges;
  }

  genNew.click();
};
