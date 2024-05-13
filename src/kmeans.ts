export function kMeans(data: number[][], k: number, progress: (_: number[][]) => void): number[][] {
    // Step 1: Initialize centroids randomly
    let centroids: number[][] = [];
    for (let i = 0; i < k; i++) {
        centroids.push(data[Math.floor(Math.random() * data.length)]);
    }

    // Step 2: Assign data points to nearest centroid
    let clusters: number[][][] = [];
    for (let i = 0; i < k; i++) {
        clusters.push([]);
    }

    let prevCentroids: number[][] = [];
    let iterations = 0;

    while (!hasConverged(centroids, prevCentroids)) {
        progress(centroids)
        // Clear clusters
        for (let i = 0; i < k; i++) {
            clusters[i] = [];
        }

        // Assign data points to nearest centroid
        for (let i = 0; i < data.length; i++) {
            const point = data[i];
            const nearestCentroidIndex = getNearestCentroidIndex(point, centroids);
            clusters[nearestCentroidIndex].push(point);
        }

        // Update centroids
        prevCentroids = [...centroids];
        centroids = updateCentroids(clusters, data);

        iterations++;
    }

    console.log(`Converged in ${iterations} iterations`);

    return centroids;
}

function hasConverged(centroids: number[][], prevCentroids: number[][]): boolean {
    if (prevCentroids.length === 0) return false;
    
    // Check if centroids have changed
    for (let i = 0; i < centroids.length; i++) {
        for (let j = 0; j < centroids[i].length; j++) {
            if (centroids[i][j] !== prevCentroids[i][j]) {
                return false;
            }
        }
    }

    return true;
}

function getNearestCentroidIndex(point: number[], centroids: number[][]): number {
    let minDistance = Number.MAX_VALUE;
    let nearestCentroidIndex = -1;

    for (let i = 0; i < centroids.length; i++) {
        const distance = euclideanDistance(point, centroids[i]);
        if (distance < minDistance) {
            minDistance = distance;
            nearestCentroidIndex = i;
        }
    }

    return nearestCentroidIndex;
}

function euclideanDistance(point1: number[], point2: number[]): number {
    let sum = 0;
    for (let i = 0; i < point1.length; i++) {
        sum += Math.pow(point1[i] - point2[i], 2);
    }
    return Math.sqrt(sum);
}

function updateCentroids(clusters: number[][][], data: number[][]): number[][] {
    const centroids: number[][] = [];

    for (let i = 0; i < clusters.length; i++) {
        const cluster = clusters[i];
        if (cluster.length === 0) {
            // If cluster is empty, assign a random data point as centroid
            centroids.push(data[Math.floor(Math.random() * data.length)]);
        } else {
            // Calculate centroid as the mean of all data points in the cluster
            const centroid = cluster[0].map((_, j) => cluster.reduce((sum, point) => sum + point[j], 0) / cluster.length);
            centroids.push(centroid);
        }
    }

    return centroids;
}