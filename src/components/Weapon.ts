import {Physics} from 'phaser';
import {BulletData} from "../gameData/BulletData.ts";
import Bullet from "../entities/Bullet.ts";
import Entity from "../entities/Entity.ts";
import IComponent from "./IComponent.ts";

export default class Weapon implements IComponent {
    public enabled: boolean = true;

    private readonly _bullets: Physics.Arcade.Group;
    private readonly _bulletData: BulletData;

    constructor(bullets: Physics.Arcade.Group, bulletData: BulletData) {
        if (!bullets) {
            console.error("Weapon 'bullets' group cannot be null or undefined");
        }

        this._bullets = bullets;
        this._bulletData = bulletData;
    }

    public shoot(source: Entity, bulletCount: number = 1, shotArc: number = 0) {
        if (!this.enabled || !this._bullets)
            return;
        
        const safeBulletCount = Math.max(1, bulletCount)
        const shotSpacing: number = safeBulletCount > 1 ? shotArc / (safeBulletCount - 1) : 0;
        let shotAngle: number = source.angle + shotArc/2;

        for(let i: number = 0; i < bulletCount; i++) {
            const bullet: Bullet = this._bullets.get() as Bullet;
            if (bullet) {
                // Get forward vector of the source entity
                const sourceForward: Phaser.Math.Vector2 = new Phaser.Math.Vector2(1, 0).rotate(Phaser.Math.DegToRad(shotAngle));
                const bulletVelocity: Phaser.Math.Vector2 = sourceForward.clone().scale(this._bulletData.speed);
                
                bullet.enable(
                    source.x + sourceForward.x * source.arcadeBody.radius, 
                    source.y + sourceForward.y * source.arcadeBody.radius,
                    bulletVelocity.x,
                    bulletVelocity.y,
                    this._bulletData
                );

                shotAngle -= shotSpacing
            }
        }
    }
}