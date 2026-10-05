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
    camera.position.z = 6.0;

    // WebGL Renderer with transparent background and high-DPI antialiasing
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Root Group for interactive rotation
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Primary Outer Cryptographic Wireframe Icosahedron
    const icosaGeometry = new THREE.IcosahedronGeometry(1.65, 0);
    const icosaWireframe = new THREE.WireframeGeometry(icosaGeometry);
    const icosaLineMat = new THREE.LineBasicMaterial({
      color: 0x221e1f,
      transparent: true,
      opacity: 0.6,
    });
    const icosaMesh = new THREE.LineSegments(icosaWireframe, icosaLineMat);
    rootGroup.add(icosaMesh);

    // 2. Vertex Constellation Points (Rosewood Stars)
    const pointsMat = new THREE.PointsMaterial({
      color: 0x8b263e, // Velvet rosewood
      size: 0.09,
      transparent: true,
      opacity: 0.95,
    });
    const vertexPoints = new THREE.Points(icosaGeometry, pointsMat);
    rootGroup.add(vertexPoints);

    // 3. Inner Cryptographic Core (Octahedron Kernel)
    const octaGeometry = new THREE.OctahedronGeometry(0.72, 0);
    const octaWireframe = new THREE.WireframeGeometry(octaGeometry);
    const octaLineMat = new THREE.LineBasicMaterial({
      color: 0x8b263e,
      transparent: true,
      opacity: 0.55,
    });
    const octaMesh = new THREE.LineSegments(octaWireframe, octaLineMat);
    rootGroup.add(octaMesh);

    // 4. Concentric Gyroscopic Rings (Dual Orbit)
    const ring1Geo = new THREE.TorusGeometry(2.15, 0.012, 12, 90);
    const ring1Mat = new THREE.LineBasicMaterial({
      color: 0x8b263e,
      transparent: true,
      opacity: 0.45,
    });
    const ring1 = new THREE.Line(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3.8;
    rootGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.42, 0.008, 12, 90);
    const ring2Mat = new THREE.LineBasicMaterial({
      color: 0x69605d,
      transparent: true,
      opacity: 0.35,
    });
    const ring2 = new THREE.Line(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 2.7;
    rootGroup.add(ring2);

    // Interaction variables
    let mouseX = 0;
    let mouseY = 0;
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let dragVelocityX = 0;
    let dragVelocityY = 0;

    // Mouse move tracking (Golden Rule 3: Informative Feedback)
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

    // Golden Rule 6: Permit easy reversal of actions (Double-click to reset angle)
    const handleDoubleClick = () => {
      rootGroup.rotation.x = 0;
      rootGroup.rotation.y = 0;
      rootGroup.rotation.z = 0;
      dragVelocityX = 0;
      dragVelocityY = 0;
    };

    // Touch support for mobile devices
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
    container.addEventListener('dblclick', handleDoubleClick);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Responsive Resize Observer
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

    // Animation loop with smooth damping
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isDragging) {
        rootGroup.rotation.y += 0.0035 + dragVelocityX;
        rootGroup.rotation.x += 0.0018 + dragVelocityY;
        dragVelocityX *= 0.95;
        dragVelocityY *= 0.95;

        // Cursor tracking tilt
        const targetRotY = mouseX * 0.45;
        const targetRotX = -mouseY * 0.45;
        rootGroup.rotation.y += (targetRotY - (rootGroup.rotation.y % (Math.PI * 2))) * 0.02;
        rootGroup.rotation.x += (targetRotX - (rootGroup.rotation.x % (Math.PI * 2))) * 0.02;
        rootGroup.position.x += (mouseX * 0.12 - rootGroup.position.x) * 0.05;
        rootGroup.position.y += (mouseY * 0.12 - rootGroup.position.y) * 0.05;
      }

      // Orbital kinetic movements
      ring1.rotation.z += 0.006;
      ring2.rotation.x -= 0.005;
      octaMesh.rotation.y -= 0.007;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('dblclick', handleDoubleClick);
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
      className="relative flex flex-col items-center justify-center p-3 border border-paper-border bg-paper-blush select-none transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Click and drag to rotate the 3D cryptographic artifact. Double-click to reset view."
    >
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="w-full h-56 sm:h-64 cursor-grab active:cursor-grabbing flex items-center justify-center"
      />

      {/* Tactile Status Bar */}
      <div className="w-full pt-2.5 mt-1 border-t border-paper-blushBorder flex items-center justify-between text-[11px] font-mono text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isInteracting ? 'bg-crimson animate-ping' : 'bg-crimson/60'}`} />
          <span className="font-semibold text-ink">3D CYPHER MATRIX</span>
        </span>
        <span className="text-[10px] uppercase tracking-wider text-ink-muted">
          {isHovered ? 'Drag to rotate • 2x click resets' : 'Tactile WebGL'}
        </span>
      </div>
    </div>
  );
};
