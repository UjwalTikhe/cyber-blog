import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const ArchivalArtifact3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 260;
    
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 6.2;

    // Renderer with transparent background and high DPI antialiasing
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Primary Wireframe Icosahedron (Outer Cryptographic Shell)
    const icosaGeometry = new THREE.IcosahedronGeometry(1.6, 0);
    const icosaWireframe = new THREE.WireframeGeometry(icosaGeometry);
    const icosaLineMat = new THREE.LineBasicMaterial({
      color: 0x1c1917,
      transparent: true,
      opacity: 0.65,
    });
    const icosaMesh = new THREE.LineSegments(icosaWireframe, icosaLineMat);
    rootGroup.add(icosaMesh);

    // 2. Vertex Nodes (Points)
    const pointsMat = new THREE.PointsMaterial({
      color: 0x881337, // Antique crimson
      size: 0.08,
      transparent: true,
      opacity: 0.9,
    });
    const vertexPoints = new THREE.Points(icosaGeometry, pointsMat);
    rootGroup.add(vertexPoints);

    // 3. Inner Core: Octahedron (Kernel)
    const octaGeometry = new THREE.OctahedronGeometry(0.7, 0);
    const octaWireframe = new THREE.WireframeGeometry(octaGeometry);
    const octaLineMat = new THREE.LineBasicMaterial({
      color: 0x881337,
      transparent: true,
      opacity: 0.5,
    });
    const octaMesh = new THREE.LineSegments(octaWireframe, octaLineMat);
    rootGroup.add(octaMesh);

    // 4. Concentric Gyroscopic Rings
    const ring1Geo = new THREE.TorusGeometry(2.1, 0.012, 12, 80);
    const ring1Mat = new THREE.LineBasicMaterial({
      color: 0x78716c,
      transparent: true,
      opacity: 0.4,
    });
    const ring1 = new THREE.Line(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 4;
    rootGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.35, 0.008, 12, 80);
    const ring2Mat = new THREE.LineBasicMaterial({
      color: 0x881337,
      transparent: true,
      opacity: 0.35,
    });
    const ring2 = new THREE.Line(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 3;
    rootGroup.add(ring2);

    // Interaction variables
    let mouseX = 0;
    let mouseY = 0;
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let dragVelocityX = 0;
    let dragVelocityY = 0;

    // Mouse move tracking (subtle tilt towards cursor)
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;

      if (isDragging) {
        const deltaX = e.clientX - previousMouseX;
        const deltaY = e.clientY - previousMouseY;
        dragVelocityX = deltaX * 0.008;
        dragVelocityY = deltaY * 0.008;
        rootGroup.rotation.y += dragVelocityX;
        rootGroup.rotation.x += dragVelocityY;
        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      setIsInteracting(true);
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    // Touch support for mobile / touchpads
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        setIsInteracting(true);
        previousMouseX = e.touches[0].clientX;
        previousMouseY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - previousMouseX;
        const deltaY = e.touches[0].clientY - previousMouseY;
        dragVelocityX = deltaX * 0.008;
        dragVelocityY = deltaY * 0.008;
        rootGroup.rotation.y += dragVelocityX;
        rootGroup.rotation.x += dragVelocityY;
        previousMouseX = e.touches[0].clientX;
        previousMouseY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth && newHeight) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Continuous ambient rotation
      if (!isDragging) {
        rootGroup.rotation.y += 0.003 + dragVelocityX;
        rootGroup.rotation.x += 0.0015 + dragVelocityY;
        dragVelocityX *= 0.95;
        dragVelocityY *= 0.95;

        // Subtle target damping towards mouse
        const targetRotY = mouseX * 0.5;
        const targetRotX = -mouseY * 0.5;
        rootGroup.rotation.y += (targetRotY - (rootGroup.rotation.y % (Math.PI * 2))) * 0.02;
        rootGroup.rotation.x += (targetRotX - (rootGroup.rotation.x % (Math.PI * 2))) * 0.02;
        rootGroup.position.x += (mouseX * 0.15 - rootGroup.position.x) * 0.05;
        rootGroup.position.y += (mouseY * 0.15 - rootGroup.position.y) * 0.05;
      }

      // Internal rings counter-rotation
      ring1.rotation.z += 0.005;
      ring2.rotation.x -= 0.004;
      octaMesh.rotation.y -= 0.006;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      icosaGeometry.dispose();
      icosaWireframe.dispose();
      icosaLineMat.dispose();
      pointsMat.dispose();
      octaGeometry.dispose();
      octaWireframe.dispose();
      octaLineMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
    };
  }, []);

  return (
    <div
      className="relative flex flex-col items-center justify-center p-3 border border-paper-border bg-paper select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-56 sm:h-64 cursor-grab active:cursor-grabbing flex items-center justify-center"
      />

      {/* Tactile Dossier Stamp & Indicator */}
      <div className="w-full pt-2.5 mt-1 border-t border-paper-border flex items-center justify-between text-[10px] font-mono text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isInteracting ? 'bg-crimson animate-ping' : 'bg-ink'}`} />
          <span>3D CYPHER MATRIX</span>
        </span>
        <span className="text-[9px] uppercase tracking-wider text-ink-muted">
          {isHovered ? 'Drag to rotate' : 'Tactile WebGL'}
        </span>
      </div>
    </div>
  );
};
